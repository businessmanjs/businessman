import Store from './store'
import { defineFreezeProperties } from './util'
import { INIT } from './types'

let worker = {},
    stores = {},
    forFront = []

const api = {
    start: () => {
        onmessage = e => {
            let storeType = e[ 0 ],
                actionType = e[ 1 ],
                payload = e[ 2 ]
            stores[ storeType ].dispatch( actionType, payload )
        }
        postMessage( { type: INIT, payload: { stores: forFront } } )
    },
    registerStore: config => {
        let store = new Store( config ),
            type = store.type
        if ( ! ( type in stores ) ) {
            stores[ type ] = store
            forFront.push( {
                type: type,
                actions: Object.assign( {}, store.actions )
            } )
        }
    }
}

for ( let prop in api ) {
    defineFreezeProperties( worker, prop, api[ prop ] )
}

export default worker
