import { on, off } from './util'

const observer = 'getter'

export default ( storeType, getter = 'default', options, worker ) => {
	return new Promise( ( resolve, reject ) => {
		let subscriber = ( state, m, got ) => {
			if ( got !== getter ) {
				return
			}
			off( storeType, subscriber, observer )
			resolve( state )
		}

		on( storeType, subscriber, observer )

		try {
			worker.postMessage( [ 'getState', storeType, getter, options ] )
		} catch ( err ) {
			off( storeType, subscriber, observer )
			reject( err )
		}
	} )
}
