import { trigger } from './util'

export default ( path, worker ) => {
    try {
        worker = new Worker( path )
        worker.postMessage( 'start' )
        worker.onmessage = ( data ) => trigger( data )
        return worker
    } catch ( e ) {
        console.error( e )
    }
}
