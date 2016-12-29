import { pack } from './util'

class Store {
    constructor ( opt ) {
        let {
            state
        } = opt
        const {
            type,
            mutations,
            actions
        } = opt
        const store = this
        const { dispatch, commit } = this

        Object.defineProperties( this, {
            type: {
                value: type,
                enumerable: false,
                writable: false,
                configurable: false
            },
            state: {
                get: () => state,
                set: newState => {
                    state = newState
                    postMessage( pack( type, state ) )
                }
            },
            mutations: {
                value: mutations,
                configurable: false,
                writable: false
            },
            actions: {
                value: actions,
                configurable: false,
                writable: false
            },
            dispatch: {
                value: ( type, payload ) => dispatch.call( store, type, payload ),
                configurable: false,
                writable: false
            },
            commit: {
                value: ( type, payload ) => commit.call( store, type, payload ),
                configurable: false,
                writable: false
            }
        } )
    }

    commit ( type, payload ) {
        this.mutations[ type ]( this, payload )
    }

    dispatch ( type, payload ) {
        this.actions[ type ]( this, payload )
    }

}

export default Store
