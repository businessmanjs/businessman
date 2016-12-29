import worker from './worker'
import _install from './install'
import _dispatch from './dispatch'
import _manager from './manager'
import _subscribe from './subscribe'
import _unsubscribe from './unsubscribe'
import _getState from './getState'
import { trigger, pack } from './util'
import { INIT, CREATE_CLIENT_STORE, CREATE_CLIENT_MANAGER } from './behaviorTypes'

let businessmanWoker = null

const install = ( path ) => {
        businessmanWoker = _install( path, businessmanWoker )
    },
    dispatch = ( storeType, actionType, payload ) => _dispatch( storeType, actionType, payload, businessmanWoker ),
    manager = ( managerType, payload ) => _manager( managerType, payload, businessmanWoker ),
    subscribe = ( type, cb ) => _subscribe( type, cb ),
    unsubscribe = ( type, cb ) => _unsubscribe( type, cb ),
    getState = ( storeType ) => _getState( storeType, businessmanWoker )

subscribe( INIT, ( data ) => {
    let stores = {},
        managers = {}
    try {
        data.stores.map( ( store ) => {
            stores[ store.type ] = {
                dispatch: ( actionType, payload ) => dispatch( store.type, actionType, payload ),
                subscribe: ( cb ) => subscribe( store.type, cb ),
                unsubscribe: ( cb ) => unsubscribe( store.type, cb ),
                getState: () => getState( store.type )
            }
        } )
        trigger( pack( CREATE_CLIENT_STORE, stores ) )
        managers = data.managers
        trigger( pack( CREATE_CLIENT_MANAGER, managers ) )
    } catch ( e ) {
        console.error( 'Error in creating client store or client manager', e )
    }
} )

export {
    install,
    dispatch,
    manager,
    subscribe,
    unsubscribe,
    getState,
    worker
}
