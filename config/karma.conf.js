module.exports = function (config) {
	config.set({
		basePath: '../',
		frameworks: ['mocha'],
		plugins: [
			'karma-mocha',
			'karma-mocha-reporter',
			'karma-phantomjs-launcher'
		],
		files: [
			'node_modules/expect.js/index.js',
			'dist/test-businessman.js',
			{
				pattern: 'dist/test-worker.js',
				included: false
			},
			'https://cdnjs.cloudflare.com/ajax/libs/es6-promise/4.0.5/es6-promise.auto.js'
		],
		proxies: {
			'/dist/': '/base/dist/'
		},
		browserConsoleLogOptions: {
			terminal: true,
			level: ''
		},
		browsers: ['PhantomJS'],
		reporters: ['mocha'],
		singleRun: true
	})
}
