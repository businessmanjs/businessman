import { trigger } from './util'

export default ( path, worker ) => {
	try {
		worker = new Worker( path )
		worker.onmessage = m => trigger( m.data, ( m.data.getter ? 'getter' : 'client' ) )
		return worker
	} catch ( err ) {
		console.error( 'Error in install', err )
	}
}
