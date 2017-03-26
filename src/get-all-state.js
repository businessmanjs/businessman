import { on, off } from './util'
import { ALLSTATE } from './observer-types'

const id = 'getAllState'

export default worker => {
	return new Promise( ( resolve, reject ) => {
		const subscriber = state => {
			off( id, subscriber, ALLSTATE )
			resolve( state )
		}

		on( id, subscriber, ALLSTATE )

		try {
			worker.postMessage( [ 'getAllState' ] )
		} catch ( err ) {
			off( id, subscriber, ALLSTATE )
			reject( err )
		}
	} )
}
