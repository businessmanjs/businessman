import {pack, assign} from '../util'
import builtInMutations from './mutations'
import builtInActions from './actions'

class Store {
	constructor(opt) {
		let {
            state,
            mutations = {},
            actions = {}
        } = opt
		const {
            type
        } = opt
		const store = this
		const {dispatch, commit} = this

		let _state = {
			get: () => state,
			set: newState => {
				state = newState
				postMessage(pack(type, state, store.appliedMutation))
			}
		}
		mutations = assign(mutations, builtInMutations)
		actions = assign(actions, builtInActions)

		Object.defineProperties(this, {
			type: {
				value: type,
				enumerable: false,
				writable: false,
				configurable: false
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
				value: (type, payload) => commit.call(store, _state, type, payload),
				configurable: false,
				writable: false
			},
			appliedMutation: {
				value: '',
				writable: true
			}
		})
	}

	commit(state, type, payload) {
		this.appliedMutation = type
		state.set(this.mutations[type](state.get(), payload))
	}

	dispatch(type, payload) {
		this.actions[type](this.commit, payload)
	}

}

export default Store
