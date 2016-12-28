const rollup = require( 'rollup' ),
    npm = require( 'rollup-plugin-node-resolve' ),
    buble = require( 'rollup-plugin-buble' )

rollup
.rollup( {
    entry: 'test/worker.js',
    plugins: [
        npm( { jsnext: true } ),
        buble()
    ]
} )
.then( bundle => {
    bundle.write( { format: 'iife', dest: 'dist/test-worker.js' } )
} )
.catch( error => {
    console.error( error )
} )
