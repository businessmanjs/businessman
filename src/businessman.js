import worker from './worker'
import install from './install'
import dispatch from './dispatch'
import subscribe from './subscribe'
import { trigger, pack, defineFreezeProperties } from './util'
import { INIT, CREATE_CLIENT_STORE } from './types'

let businessman = {},
    businessmanWoker = null

const api = {
    install: ( path ) => {
        businessmanWoker = install( path, businessmanWoker )
    },
    dispatch: ( storeType, actionType, payload ) => dispatch( storeType, actionType, payload, businessmanWoker ),
    subscribe: ( type, cb ) => subscribe( type, cb ),
    worker: worker
}

for ( let prop in api ) {
    defineFreezeProperties( businessman, prop, api[ prop ] )
}

subscribe( INIT, ( data ) => {
    let stores = {}
    try {
        data.stores.map( ( store ) => {
            stores[ store.type ] = {
                dispatch: ( actionType, payload ) => {
                    dispatch( store.type, actionType, payload, businessmanWoker )
                },
                subscribe: ( cb ) => {
                    subscribe( store.type, cb )
                }
            }
        } )
        trigger( pack( CREATE_CLIENT_STORE, stores ) )
    } catch ( e ) {
        console.error( e )
    }
} )

export default businessman
