const rollup = require( 'rollup' ),
    npm = require( 'rollup-plugin-node-resolve' ),
    buble = require( 'rollup-plugin-buble' ),
    commonjs = require( 'rollup-plugin-commonjs' ),
    name = 'businessman'

rollup
.rollup( {
    entry: `src/${ name }.js`,
    plugins: [
        npm( { jsnext: true } ),
        buble(),
        commonjs()
    ]
} )
.then( bundle => {
    bundle.write( { format: 'es', dest: `dist/${ name }.es.js` } )
    bundle.write( { format: 'amd', dest: `dist/${ name }.amd.js` } )
    bundle.write( {
        format: 'umd',
        dest: `dist/${ name }.js`,
        moduleName: name
    } )
} )
.catch( error => {
    console.error( error )
} )
