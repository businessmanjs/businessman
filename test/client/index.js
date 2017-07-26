import {install, dispatch, operate, subscribe, unsubscribe, getState, getAllState} from '../../index'
import {time, timeEnd, timeAverage, reset} from '../time'

describe('Businessman Specs', () => {
	let initDatas
	let initialize = false

	before(() => {
		reset()
	})

	beforeEach(done => {
		let i = 0
		const counterSubscriber = state => {
			console.log('counter', timeEnd('counter'))
			i++
			unsubscribe('counter')
			if (state === 0 && i === 2) {
				done()
			}
		}
		const messageSubscriber = state => {
			console.log('message', timeEnd('message'))
			i++
			unsubscribe('message')
			if (state === '' && i === 2) {
				done()
			}
		}
		if (initialize) {
			subscribe('counter', counterSubscriber)
			time('counter')
			dispatch('counter', 'set', 0)
			subscribe('message', messageSubscriber)
			time('message')
			dispatch('message', 'set', '')
		} else {
			done()
		}
	})

	afterEach(() => {
		if (initialize) {
			unsubscribe('counter')
			unsubscribe('message')
		}
	})

	after(() => {
		console.log('Average', timeAverage())
	})

	it('Install Worker', done => {
		subscribe('INIT', data => {
			initDatas = data
			initialize = true
			expect(data).to.be.ok()
			done()
		})
		install('/dist/test-worker.js')
	})

	it('INIT data has store and managers', () => {
		expect(initDatas).to.be.ok()
		expect(initDatas.stores[0]).to.be('counter')
		expect(initDatas.stores[1]).to.be('message')
		expect(initDatas.stores[2]).not.to.be.ok()
		expect(initDatas.managers[0]).to.be('countUpMessage')
		expect(initDatas.managers[1]).not.to.be.ok()
	})

	it('Dispatch and subscribe', done => {
		dispatch('counter', 'increment', 1)
		subscribe('counter', (state, applied) => {
			expect(state).to.be(1)
			expect(applied).to.be('increment')
		})
		dispatch('message', 'set', 'This is a test')
		subscribe('message', (state, applied) => {
			expect(state).to.be('This is a test')
			expect(applied).to.be('set')
			done()
		})
	})

	it('If the third argument of commit is false it will not provide state', done => {
		dispatch('counter', 'silentSet', 1)
		subscribe('counter', (state, applied) => {
			expect(state).to.be(null)
			expect(applied).to.be('set')
			done()
		})
	})

	it('Unsubscribe', done => {
		let i = 0
		let counterSubscriber = () => {
			i++
		}
		subscribe('counter', counterSubscriber)
		dispatch('counter', 'increment')
		setTimeout(() => {
			unsubscribe('counter', counterSubscriber)
			dispatch('counter', 'increment')
			expect(i).to.be(1)
			done()
		}, 500)
	})

	it('Get store state', done => {
		dispatch('counter', 'set', 123456)
		getState('counter').then(state => {
			expect(state).to.be(123456)
			done()
		})
	})

	it('Get store state by getters', done => {
		dispatch('message', 'set', 'This is a test')
		getState('message', 'wordCount').then(state => {
			expect(state).to.be(14)
			done()
		})
	})

	it('Execute action crossed to multiple stores by manager', done => {
		operate('countUpMessage', 1)
		subscribe('counter', state => {
			expect(state).to.be(1)
		})
		unsubscribe('message')
		subscribe('message', state => {
			expect(state).to.be('1 has been added to the counter')
			done()
		})
	})

	it('Get state of all stores with getAllState', done => {
		const states = {}
		const test = () => {
			getAllState().then(state => {
				expect(state.counter).to.equal(states.counter)
				expect(state.message).to.equal(states.message)
				done()
			})
		}
		getState('counter').then(state => {
			states.counter = state
			if ('message' in states) {
				test()
			}
		})
		getState('message').then(state => {
			states.message = state
			if ('counter' in states) {
				test()
			}
		})
	})
})
