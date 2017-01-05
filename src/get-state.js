import dispatch from './dispatch'
import subscribe from './subscribe'
import unsubscribe from './unsubscribe'
import { GET_STATE } from './behavior-types'

export default ( storeType, worker ) => {
	return new Promise( ( resolve, reject ) => {
		let subscriber = ( state, applied ) => {
			if ( applied !== GET_STATE ) {
				return
			}
			unsubscribe( storeType, subscriber )
			resolve( state )
		}

		subscribe( storeType, subscriber )

		try {
			dispatch( storeType, GET_STATE, '', worker )
		} catch ( err ) {
			reject( err )
			unsubscribe( storeType, subscriber )
		}
	} )
}
