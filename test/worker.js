import {worker} from '../src/businessman'

worker.registerStore({
	type: 'counter',
	state: 0,
	mutations: {
		increment: (state, num) => {
			let n = state += num
			return n
		},
		set: (state, num) => num
	},
	actions: {
		increment: (commit, num = 1) => {
			commit('increment', num)
		},
		set: (commit, num = 0) => {
			commit('set', num)
		},
		silentSet: (commit, num = 0) => {
			commit('set', num, false)
		}
	}
})

worker.registerStore({
	type: 'message',
	state: '',
	getters: {
		wordCount: state => state.length
	},
	mutations: {
		set: (state, mes) => mes
	},
	actions: {
		set: (commit, mes = '') => {
			commit('set', mes)
		}
	}
})

worker.registerManager({
	type: 'countUpMessage',
	handler: (stores, num = 1) => {
		stores.counter.dispatch('increment', num)
		stores.message.dispatch('set', `${num} has been added to the counter`)
	}
})

worker.start()
