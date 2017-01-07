import { pack, assign } from '../util'
import builtInGetters from './getters'
import builtInMutations from './mutations'
import builtInActions from './actions'

class Store {
	constructor ( opt ) {
		let {
            state,
            mutations = {},
            actions = {},
			getters = {}
        } = opt
		const {
            type
        } = opt
		const store = this
		const { dispatch, commit, getState } = this

		let _state = {
			get: () => state,
			set: newState => {
				state = newState
				postMessage( pack( type, state, store.appliedMutation ) )
			}
		}
		getters = assign( getters, builtInGetters )
		mutations = assign( mutations, builtInMutations )
		actions = assign( actions, builtInActions )

		Object.defineProperties( this, {
			type: {
				value: type,
				enumerable: false,
				writable: false,
				configurable: false
			},
			getters: {
				value: getters,
				configurable: false,
				writable: false
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
				value: ( type, payload ) => commit.call( store, _state, type, payload ),
				configurable: false,
				writable: false
			},
			getState: {
				value: ( type, payload ) => getState.call( store, _state, type, payload ),
				configurable: false,
				writable: false
			},
			appliedMutation: {
				value: '',
				writable: true
			}
		} )
	}

	getState ( state, type = 'default', payload ) {
		const get = this.getters[ type ]( state.get(), payload, this.getters )
		postMessage( pack( this.type, get, 'getState', type ) )
	}

	commit ( state, type, payload ) {
		this.appliedMutation = type
		state.set( this.mutations[ type ]( state.get(), payload ) )
	}

	dispatch ( type, payload ) {
		this.actions[ type ]( this.commit, payload )
	}

}

export default Store
