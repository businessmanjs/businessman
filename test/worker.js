import {worker} from '../src/businessman'

worker.addStore({
	type: 'counter',
	state: 0,
	mutations: {
		increment(state, num) {
			let n = state += num
			return n
		},
		set(state, num) {
			return num
		}
	},
	actions: {
		increment(commit, num = 1) {
			commit('increment', num)
		},
		set(commit, num = 0) {
			commit('set', num)
		},
		silentSet(commit, num = 0) {
			commit('set', num, false)
		}
	}
})

worker.addStore({
	type: 'message',
	state: '',
	getters: {
		wordCount(state) {
			return state.length
		},
		wordSlice(state, opt) {
			const {
				begin,
				end
			} = opt
			return state.slice(begin, end)
		}
	},
	mutations: {
		set(state, mes) {
			return mes
		}
	},
	actions: {
		set(commit, mes = '') {
			commit('set', mes)
		}
	}
})

worker.addManager({
	type: 'countUpMessage',
	handler(stores, num = 1) {
		stores.counter.dispatch('increment', num)
		stores.message.dispatch('set', `${num} has been added to the counter`)
	}
})

worker.start()
