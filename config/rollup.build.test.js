const rollup = require( 'rollup' ),
    npm = require( 'rollup-plugin-node-resolve' ),
    buble = require( 'rollup-plugin-buble' ),
    commonjs = require( 'rollup-plugin-commonjs' )

rollup.rollup( {
    entry: 'test/businessman.js',
    plugins: [
        npm( { jsnext: true } ),
        buble(),
        commonjs()
    ]
} )
.then( bundle => {
    bundle.write( { format: 'iife', dest: 'dist/test-businessman.js' } )
} )
.catch( error => {
    console.error( error )
} )

rollup.rollup( {
    entry: 'test/worker.js',
    plugins: [
        npm( { jsnext: true } ),
        buble(),
        commonjs()
    ]
} )
.then( bundle => {
    bundle.write( { format: 'iife', dest: 'dist/test-worker.js' } )
} )
.catch( error => {
    console.error( error )
} )
