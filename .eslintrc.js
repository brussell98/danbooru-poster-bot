module.exports = {
	parserOptions: {
		ecmaVersion: 2019,
		sourceType: 'module'
	},
	env: {
		node: true,
		es6: true
	},
	extends: 'eslint:recommended',
	rules: {
		'no-control-regex': 'off',
		'no-alert': 'warn',
		'no-else-return': 'warn',
		'no-redeclare': 'error',
		'no-useless-escape': 'warn',
		'no-inner-declarations': 'off',
		'array-bracket-spacing': ['warn', 'never'],
		'brace-style': ['warn', '1tbs', {
			allowSingleLine: true
		}],
		curly: ['warn', 'multi'],
		'no-trailing-spaces': 'warn',
		'space-before-function-paren': ['warn', {
			anonymous: 'never',
			named: 'never',
			asyncArrow: 'always'
		}],
		'arrow-spacing': 'warn',
		'comma-spacing': ['warn', {
			'before': false,
			'after': true
		}],
		'comma-dangle': 'warn',
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		indent: ['error', 'tab', { SwitchCase: 1 }],
		quotes: ['error', 'single', { avoidEscape: true }],
		'array-callback-return': 'error',
		eqeqeq: ['warn', 'always', { null: 'ignore' }],
		'no-empty-function': ['error', {
			allow: [
				'arrowFunctions',
				'functions',
				'methods'
			]
		}],
		'no-eval': 'error',
		'no-implied-eval': 'error',
		'no-return-assign': 'error',
		'no-unmodified-loop-condition': 'off',
		'no-empty': 'error',
		'no-extra-semi': 'error',
		'no-invalid-regexp': 'error',
		'no-irregular-whitespace': 'error',
		'no-regex-spaces': 'error',
		'no-unreachable': 'error',
		'no-warning-comments': ['warn', {
			terms: ['todo', 'fixme'],
			location: 'start'
		}],
		'valid-typeof': ['error', { requireStringLiterals: false }],
		'constructor-super': 'error',
		'no-const-assign': 'error',
		'no-dupe-class-members': 'error',
		'no-var': 'error',
		'prefer-const': ['error', {
			destructuring: 'all',
			ignoreReadBeforeAssign: false
		}],
		'no-lonely-if': 'error',
		'no-extra-parens': ['warn', 'all', {
			ignoreJSX: 'multi-line',
			nestedBinaryExpressions: false
		}],
		'object-shorthand': ['error', 'always', {
			ignoreConstructors: false,
			avoidQuotes: true
		}],
		'block-spacing': ['error', 'always'],
		'eol-last': ['error', 'always'],
		'no-console': 'off',
		semi: ['error', 'always'],
		'no-multiple-empty-lines': ['warn', {
			max: 1
		}]
	}
};
