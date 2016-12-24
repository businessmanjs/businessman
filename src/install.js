import { trigger } from './util'

export default ( path, worker ) => {
    try {
        worker = new Worker( path )
        worker.onmessage = function ( data ) {
            trigger( data )
        }
        return worker
    } catch ( e ) {
        console.error( e )
    }
}
