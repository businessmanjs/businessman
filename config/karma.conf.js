module.exports = function ( config ) {
    config.set( {
        basePath: '../',
        frameworks: [ 'mocha' ],
        plugins: [
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-electron-launcher'
        ],
        files: [
            'node_modules/expect.js/index.js',
            'dist/businessman.js',
            'test/businessman.js',
            {
                pattern: 'dist/test-worker.js',
                included: false
            }
        ],
        proxies: {
            '/dist/': '/base/dist/'
        },
        browsers: [ 'Electron' ],
        reporters: [ 'mocha' ],
        singleRun: true
    } )
}
