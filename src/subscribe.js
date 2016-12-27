import { on } from './util'

export default ( type, cb ) => {
    try {
        on( type, cb )
    } catch ( e ) {
        console.error( 'Error in subscribe', e )
    }
}
