let worker = {},
    action = {},
    mutation = {},
    store = {}

const api = {
    start: function () {
        onmessage = e => {
            let actiontype = e[ 1 ],
                payload = e[ 2 ]
            action[ actiontype ]( payload )
        }
    },
    store: function ( conf ) {
        Object.defineProperties( store, {
            [ store.type ]: {
                value: store.state,
                get: function () {
                    return store.state
                },
                set: function ( state ) {
                    store.state = state
                    postMessage( store )
                }
            }
        } )
    }
}

for ( let prop in api ) {
    Object.defineProperties( worker, {
        [ prop ]: {
            value: api[ prop ],
            enumerable: false,
            writable: true,
            configurable: false
        }
    } )
}

export let action = action

export default worker
