import Store from './store/Store'
import { pack } from './util'
import { INIT } from './behaviorTypes'

let stores = {},
    forFront = []

const worker = {
    start: () => {
        onmessage = e => {
            let storeType = e.data[ 0 ],
                actionType = e.data[ 1 ],
                payload = e.data[ 2 ]
            stores[ storeType ].dispatch( actionType, payload )
        }
        postMessage( pack( INIT, { stores: forFront } ) )
    },
    registerStore: config => {
        let store = new Store( config ),
            type = store.type
        if ( ! ( type in stores ) ) {
            stores[ type ] = store
            forFront.push( {
                type: type,
                actions: Object.keys( store.actions )
            } )
        }
    }
}

export default Object.freeze( worker )
