let worker = {},
    action = {},
    mutation = {},
    store = {}

const api = {
    start: function () {
        onmessage = e => {
            let actiontype = e[ 0 ],
                payload = e[ 1 ]
            action[ actiontype ]( payload )
        }
        postMessage( { type: 'init', payload: { store: store, action: action } } )
    },
    commit: function ( e ) {
        let mutationtype = e[ 0 ],
            payload = e[ 1 ]
        mutation[ mutationtype ]( store, payload )
    },
    createStore: function ( conf ) {
        Object.defineProperties( store, {
            [ conf.type ]: {
                value: conf.state,
                get: () => conf.state,
                set: state => {
                    conf.state = state
                    postMessage( { type: conf.type, payload: conf.state } )
                }
            }
        } )
    },
    createMutation: function ( conf ) {
        Object.defineProperties( mutation, {
            [ conf.type ]: {
                value: conf.handler
            }
        } )
    },
    createAction: function ( conf ) {
        Object.defineProperties( action, {
            [ conf.type ]: {
                value: conf.handler
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
