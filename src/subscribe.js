import { on } from './util'

export default ( data, cb ) => {
    try {
        on( data.type, cb )
    } catch ( e ) {
        console.error( e )
    }
}
