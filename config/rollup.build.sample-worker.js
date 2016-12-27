import nodeResolve from 'rollup-plugin-node-resolve'
import buble from 'rollup-plugin-buble'

export default {
    entry: 'test/sample-worker.js',
    dest: 'dist/sample-worker.js',
    format: 'iife',
    plugins: [
        nodeResolve( { jsnext: true } ),
        buble()
    ]
}
