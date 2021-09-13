const axios = require('axios');
const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/timezone'));

const config = require('./config');

const sleep = ms => new Promise(res => setTimeout(res, ms));

function convertDanbooruNames(tagString) {
	return tagString.replace(/(^|_| )(\()?(\w)/g, (_, under, paren, letter) =>
		`${under ? under === ' ' ? ', ' : ' ' : ''}${paren ? '(' : ''}${letter.toUpperCase()}`);
}

function getNextTime(setting) {
	let nextTime = Infinity;
	const now = setting.timezone ? dayjs().tz(setting.timezone) : dayjs();

	for (const timeString of setting.times) {
		const [hour, minute] = timeString.split(':');
		let time = setting.timezone ? dayjs().tz(setting.timezone) : dayjs();
		time = time.hour(parseInt(hour, 10)).minute(minute ? parseInt(minute, 10) : 0)
			.second(0).millisecond(0);

		if (now.isAfter(time))
			time = time.add(1, 'day');

		if (time.valueOf() < nextTime)
			nextTime = time.valueOf();
	}

	return nextTime;
}

function getUrlForType(type) {
	switch (type) {
		case 'posts':
			return 'https://danbooru.donmai.us/posts.json';
		default:
			throw new Error('Unsupported type: ' + type);
	}
}

async function getPost(setting, alreadySentIds) {
	const urlBase = getUrlForType(setting.type);
	const res = await axios.get(`${urlBase}?${setting.tags ? `tags=${setting.tags}&` : '' }limit=${setting.limit || 100}`);

	const posts = res.data.filter(p =>
		p.id && p.file_url &&
		!(alreadySentIds.includes(p.id) || alreadySentIds.includes(p.parent_id)) &&
		(!setting.excludeRatings || !setting.excludeRatings.includes(p.rating)) &&
		(!setting.excludeTags || !p.tag_string.split(' ').some(tag => setting.excludeTags.includes(tag)))
	);

	return posts.length > 0 ? posts[0] : null;
}

async function postToWebhook(setting, post) {
	const fields = [];
	if (post.tag_string_artist)
		fields.push({
			name: 'Artist' + (post.tag_string_artist.includes(' ') ? 's' : ''),
			value: convertDanbooruNames(post.tag_string_artist).substring(0, 1024),
			inline: true
		});
	if (post.tag_string_copyright)
		fields.push({
			name: 'Copyright' + (post.tag_string_copyright.includes(' ') ? 's' : ''),
			value: convertDanbooruNames(post.tag_string_copyright).substring(0, 1024),
			inline: true
		});
	if (post.tag_string_character)
		fields.push({
			name: 'Character' + (post.tag_string_character.includes(' ') ? 's' : ''),
			value: convertDanbooruNames(post.tag_string_character).substring(0, 1024),
			inline: true
		});
	if (fields.length === 3)
		fields[2].inline = false;

	return axios.post(setting.url, {
		embeds: [{
			title: post.id,
			url: 'https://danbooru.donmai.us/posts/' + post.id,
			color: parseInt(setting.color === undefined ? '0073ff' : setting.color, 16),
			image: {
				url: post.file_url,
			},
			fields
		}]
	}, {
		headers: { 'User-Agent': config.userAgent }
	});
}

async function runForSetting(setting) {
	const alreadySentIds = [];

	while (true) {
		try {
			const time = getNextTime(setting);
			console.log(`Next post for ${setting.name} on ${(setting.timezone ? dayjs.tz(time, setting.timezone) : dayjs(time)).format('dddd [at] h:mma')}`);

			await sleep(time - Date.now());

			const post = await getPost(setting, alreadySentIds);
			if (post) {
				alreadySentIds.push(post.parent_id || post.id);
				if (alreadySentIds.length > 10)
					alreadySentIds.shift();

				await postToWebhook(setting, post);
			}

			await sleep(10e3);
		} catch (error) {
			console.error(error);

			await sleep(60e3);
		}
	}
}

for (const setting of config.webhooks)
	runForSetting(setting);
