import { pack } from './util'

class Store {
    constructor ( opt ) {
        opt = Object.assign( {
            type: '',
            state: null,
            mutations: {},
            actions: {}
        }, opt )

        const store = this
        const { dispatch, commit } = this

        Object.defineProperties( this, {
            type: {
                value: opt.type,
                enumerable: false,
                writable: false,
                configurable: false
            },
            state: {
                get: () => opt.state,
                set: state => {
                    opt.state = state
                    postMessage( pack( opt.type, opt.state ) )
                }
            },
            mutations: {
                value: opt.mutations,
                configurable: false,
                writable: false
            },
            actions: {
                value: opt.actions,
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
