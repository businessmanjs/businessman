import { trigger } from './util'

export default ( path, worker ) => {
    try {
        worker = new Worker( path )
        worker.onmessage = ( message ) => trigger( message.data )
        return worker
    } catch ( e ) {
        console.error( e )
    }
}
