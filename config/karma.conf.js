module.exports = function ( config ) {
    config.set( {
        basePath: '../',
        frameworks: [ 'mocha' ],
        plugins: [
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher'
        ],
        files: [
            'node_modules/expect.js/index.js',
            'dist/businessman.js',
            'test/businessman.js',
            {
                pattern: 'dist/sample-worker.js',
                included: false
            }
        ],
        proxies: {
            '/dist/': '/base/dist/'
        },
        browsers: [ 'Chrome' ],
        reporters: [ 'mocha' ],
        singleRun: true
    } )
}
