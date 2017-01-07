import worker from './worker'
import _install from './install'
import _dispatch from './dispatch'
import _operate from './operate'
import _subscribe from './subscribe'
import _unsubscribe from './unsubscribe'
import _getState from './get-state'
import { trigger, pack } from './util'
import { INIT, CREATE_CLIENT_STORE, CREATE_CLIENT_MANAGER } from './behavior-types'

let businessmanWoker = null

const install = path => {
	businessmanWoker = _install( path, businessmanWoker )
}
const dispatch = ( storeType, actionType, payload ) => _dispatch( storeType, actionType, payload, businessmanWoker )
const operate = ( managerType, payload ) => _operate( managerType, payload, businessmanWoker )
const subscribe = ( type, cb ) => _subscribe( type, cb )
const unsubscribe = ( type, cb ) => _unsubscribe( type, cb )
const getState = ( storeType, getter, options ) => _getState( storeType, getter, options, businessmanWoker )

subscribe( INIT, data => {
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
		trigger( pack( CREATE_CLIENT_STORE, stores ) )
		trigger( pack( CREATE_CLIENT_MANAGER, data.managers ) )
	} catch ( err ) {
		console.error( 'Error in creating client store or client manager', err )
	}
} )

export {
    install,
    dispatch,
    operate,
    subscribe,
    unsubscribe,
    getState,
    worker
}
