import {pack, assign} from '../util'
import builtInGetters from './getters'
import builtInMutations from './mutations'
import builtInActions from './actions'

class Store {
	constructor(opt) {
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
		const {dispatch, commit, getState} = this

		let _state = {
			get: () => state,
			set: (newState, mutationType, provide) => {
				state = newState
				postMessage((provide ? pack({type: type, payload: state, mutation: mutationType}) : pack({type: type, mutation: mutationType})))
			}
		}
		getters = assign(getters, builtInGetters)
		mutations = assign(mutations, builtInMutations)
		actions = assign(actions, builtInActions)

		Object.defineProperties(this, {
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
				value: (type, payload) => dispatch.call(store, type, payload),
				configurable: false,
				writable: false
			},
			commit: {
				value: (type, payload, provide = true) => commit.call(store, _state, type, payload, provide),
				configurable: false,
				writable: false
			},
			getState: {
				value: (type, payload) => getState.call(store, _state, type, payload),
				configurable: false,
				writable: false
			}
		})
	}

	getState(state, type = 'default', payload) {
		const get = this.getters[type](state.get(), payload, this.getters)
		return get
	}

	commit(state, type, payload, provide) {
		state.set(this.mutations[type](state.get(), payload), type, provide)
	}

	dispatch(type, payload) {
		this.actions[type](this.commit, payload)
	}

}

export default Store
