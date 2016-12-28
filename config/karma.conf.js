module.exports = function ( config ) {
    config.set( {
        basePath: '../',
        frameworks: [ 'mocha' ],
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
            }
        ],
        proxies: {
            '/dist/': '/base/dist/'
        },
        browsers: [ 'PhantomJS' ],
        reporters: [ 'mocha' ],
        singleRun: true
    } )
}
