import subscribe from './subscribe'
import unsubscribe from './unsubscribe'

export default ( storeType, getter = 'default', options, worker ) => {
	return new Promise( ( resolve, reject ) => {
		let subscriber = ( state, applied, got ) => {
			if ( applied !== 'getState' || got !== getter ) {
				return
			}
			unsubscribe( storeType, subscriber )
			resolve( state )
		}

		subscribe( storeType, subscriber )

		try {
			worker.postMessage( [ 'getState', storeType, getter, options ] )
		} catch ( err ) {
			unsubscribe( storeType, subscriber )
			reject( err )
		}
	} )
}
