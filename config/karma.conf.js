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
            'test/businessman.js'
        ],
        proxies: {
            '/dist/': 'http://localhost:9000/dist/'
        },
        browsers: [ 'Chrome' ],
        reporters: [ 'mocha' ],
        singleRun: true
    } )
}
