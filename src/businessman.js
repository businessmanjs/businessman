import worker from './worker'
import install from './install'
import dispatch from './dispatch'
import subscribe from './subscribe'
import { defineFreezeProperties } from './util'
import { INIT } from './types'

let businessman = {},
    businessmanWoker = null,
    stores = {}

const api = {
    install: ( path ) => {
        businessmanWoker = install( path, businessmanWoker )
    },
    dispatch: ( storeType, actionType, payload ) => dispatch( storeType, actionType, payload, businessmanWoker ),
    subscribe: ( type, cb ) => subscribe( type, cb ),
    worker: worker,
    stores: stores
}

for ( let prop in api ) {
    defineFreezeProperties( businessman, prop, api[ prop ] )
}

subscribe( INIT, ( data ) => {
    try {
        data.stores.map( ( store ) => {
            stores[ store.type ] = {
                dispatch: ( actionType, payload ) => {
                    dispatch( store.type, actionType, payload, businessmanWoker )
                },
                subscribe: ( type, cb ) => {
                    subscribe( type, cb )
                }
            }
        } )
        businessman.stores = stores
    } catch ( e ) {
        console.error( e )
    }
} )

export default businessman
