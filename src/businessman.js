import worker from './worker'
import _install from './install'
import _dispatch from './dispatch'
import _subscribe from './subscribe'
import _unsubscribe from './unsubscribe'
import _getState from './getState'
import { trigger, pack } from './util'
import { INIT, CREATE_CLIENT_STORE } from './behaviorTypes'

let businessmanWoker = null

const install = ( path ) => {
        businessmanWoker = _install( path, businessmanWoker )
    },
    dispatch = ( storeType, actionType, payload ) => _dispatch( storeType, actionType, payload, businessmanWoker ),
    subscribe = ( type, cb ) => _subscribe( type, cb ),
    unsubscribe = ( type, cb ) => _unsubscribe( type, cb ),
    getState = ( storeType ) => _getState( storeType, businessmanWoker )

subscribe( INIT, ( data ) => {
    let stores = {}
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
    } catch ( e ) {
        console.error( 'Error in creating client store', e )
    }
} )

export {
    install,
    dispatch,
    subscribe,
    unsubscribe,
    getState,
    worker
}
