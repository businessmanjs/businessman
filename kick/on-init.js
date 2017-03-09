import { dispatch, subscribe, unsubscribe, getState } from '../src/businessman'
import { INIT, CREATE_CLIENT_STORE, CREATE_CLIENT_MANAGER } from '../src/built-in-types'
import { trigger, pack } from '../src/util'

export default () => subscribe( INIT, data => {
	let stores = {}
	try {
		data.stores.map( store => {
			stores[ store.type ] = {
				dispatch: ( actionType, payload ) => dispatch( store.type, actionType, payload ),
				subscribe: cb => subscribe( store.type, cb ),
				unsubscribe: cb => unsubscribe( store.type, cb ),
				getState: ( getter, options ) => getState( store.type, getter, options )
			}
			return store
		} )
		trigger( pack( { type: CREATE_CLIENT_STORE, payload: stores } ) )
		trigger( pack( { type: CREATE_CLIENT_MANAGER, payload: data.managers } ) )
	} catch ( err ) {
		console.error( 'Error in creating client store or client manager', err )
	}
} )
