const rollup = require( 'rollup' )
const npm = require( 'rollup-plugin-node-resolve' )
const buble = require( 'rollup-plugin-buble' )
const commonjs = require( 'rollup-plugin-commonjs' )

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
.catch( err => {
	console.error( err )
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
.catch( err => {
	console.error( err )
} )
