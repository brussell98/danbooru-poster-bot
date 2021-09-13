module.exports = {
	webhooks: [{
		name: '#nyanbooru', // Setting name
		url: 'https://discord.com/api/webhooks/{channel}/{token}',
		type: 'posts',
		tags: 'animal_ears order:rank',
		excludeRatings: ['e'], // Explicit
		excludeTags: ['spoilers', 'fake_animal_ears', 'etc...'], // Tags to not allow
		limit: 50, // Number of posts to fetch from the API
		times: ['6:00', '12:00', '18:00', '24:00'], // Times to post at
		timezone: 'America/Chicago'
	}],
	userAgent: 'danbooru-poster-bot' // Change this
};
