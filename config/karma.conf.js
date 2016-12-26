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
            'dist/sample-worker.js',
            'test/businessman.js'
        ],
        browsers: [ 'Chrome', 'Firefox' ],
        reporters: [ 'mocha' ],
        singleRun: true
    } )
}
