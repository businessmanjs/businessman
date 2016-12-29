import builtInMutations from './mutations'
import builtInActions from './actions'
import { pack, assign } from '../util'

class Store {
    constructor ( opt ) {
        let {
            state,
            mutations = {},
            actions = {}
        } = opt
        const {
            type
        } = opt
        const store = this
        const { dispatch, commit } = this

        mutations = assign( mutations, builtInMutations )
        actions = assign( actions, builtInActions )

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
                    postMessage( pack( type, state, store.appliedMutation ) )
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
            },
            appliedMutation: {
                value: '',
                writable: true
            }
        } )
    }

    commit ( type, payload ) {
        this.appliedMutation = type
        this.mutations[ type ]( this, payload )
    }

    dispatch ( type, payload ) {
        this.actions[ type ]( this, payload )
    }

}

export default Store
