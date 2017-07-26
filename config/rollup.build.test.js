const rollup = require('rollup')
const npm = require('rollup-plugin-node-resolve')
const buble = require('rollup-plugin-buble')
const commonjs = require('rollup-plugin-commonjs')
const multiEntry = require('rollup-plugin-multi-entry')

rollup.rollup({
	entry: 'test/client/*.js',
	plugins: [
		npm({jsnext: true}),
		buble(),
		commonjs(),
		multiEntry()
	]
})
.then(bundle => {
	bundle.write({format: 'iife', moduleName: 'businessman', dest: 'dist/test-businessman.js'})
})
.catch(err => {
	console.error(err)
})

rollup.rollup({
	entry: 'test/worker.js',
	plugins: [
		npm({jsnext: true}),
		buble(),
		commonjs()
	]
})
.then(bundle => {
	bundle.write({format: 'iife', dest: 'dist/test-worker.js'})
})
.catch(err => {
	console.error(err)
})
