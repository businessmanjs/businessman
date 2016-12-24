import { on } from './util'

export default ( cntrl, cb ) => {
    try {
        on( cntrl, cb )
    } catch ( e ) {
        console.error( e )
    }
}
