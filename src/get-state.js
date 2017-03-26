import { on, off } from './util'
import { GETTER } from './types/observer'

export default ( storeType, getter = 'default', options, worker ) => {
	return new Promise( ( resolve, reject ) => {
		let subscriber = ( state, m, got ) => {
			if ( got !== getter ) {
				return
			}
			off( storeType, subscriber, GETTER )
			resolve( state )
		}

		on( storeType, subscriber, GETTER )

		try {
			worker.postMessage( [ 'getState', storeType, getter, options ] )
		} catch ( err ) {
			off( storeType, subscriber, GETTER )
			reject( err )
		}
	} )
}
