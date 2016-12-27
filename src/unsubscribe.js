import { off } from './util'

export default ( type, cb ) => {
    try {
        off( type, cb )
    } catch ( e ) {
        console.error( 'Error in unsubscribe', e )
    }
}
