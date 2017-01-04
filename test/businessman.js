import {install, dispatch, operate, subscribe, unsubscribe, getState} from '../src/businessman'

describe('businessman specs', function () {
	var stores

	it('Install Worker', function (done) {
		subscribe('CREATE_CLIENT_STORE', data => {
			stores = data
			expect(data).to.be.ok()
			done()
		})
		install('/dist/test-worker.js')
	})

	it('Store for clients includes dispatch() and subscribe()', function () {
		expect(stores).to.be.ok()
		let storeKeys = Object.keys(stores)
		for (let i = 0; i < storeKeys.length; i++) {
			let store = storeKeys[i]
			expect(stores[store]).to.have.property('dispatch')
			expect(stores[store]).to.have.property('subscribe')
			expect(stores[store].dispatch).to.be.an('function')
			expect(stores[store].subscribe).to.be.an('function')
		}
	})

	it('Dispatch and subscribe from the client store', function (done) {
		stores.counter.dispatch('increment', 1)
		stores.counter.subscribe(function (state, applied) {
			expect(state).to.be(1)
			expect(applied).to.be('increment')
		})
		stores.message.dispatch('set', 'This is a test')
		stores.message.subscribe(function (state, applied) {
			expect(state).to.be('This is a test')
			expect(applied).to.be('set')
			done()
		})
	})

	it('Unsubscribe from the client store', function (done) {
		stores.counter.unsubscribe()
		let i = 0
		let counterSubscriber = function () {
			i++
		}
		stores.counter.subscribe(counterSubscriber)
		stores.counter.dispatch('increment')
		setTimeout(function () {
			stores.counter.unsubscribe(counterSubscriber)
			stores.counter.dispatch('increment')
			expect(i).to.be(1)
			done()
		}, 500)
	})

	it('Get store state', function (done) {
		stores.counter.unsubscribe()
		stores.counter.dispatch('set', 123456)
		stores.counter.getState().then(state => {
			expect(state).to.be(123456)
			done()
		})
	})

	it('Dispatch and subscribe from the Businessman', function (done) {
		dispatch('counter', 'set', 0)
		setTimeout(() => {
			dispatch('counter', 'increment', 1)
			subscribe('counter', function (state, applied) {
				expect(state).to.be(1)
				expect(applied).to.be('increment')
			})
			dispatch('message', 'set', 'This is a test')
			subscribe('message', function (state, applied) {
				expect(state).to.be('This is a test')
				expect(applied).to.be('set')
				done()
			})
		}, 500)
	})

	it('Unsubscribe from the Businessman', function (done) {
		unsubscribe('counter')
		let i = 0
		let counterSubscriber = function () {
			i++
		}
		subscribe('counter', counterSubscriber)
		dispatch('counter', 'increment')
		setTimeout(function () {
			unsubscribe('counter', counterSubscriber)
			dispatch('counter', 'increment')
			expect(i).to.be(1)
			done()
		}, 500)
	})

	it('Get store state from the Businessman', function (done) {
		unsubscribe('counter')
		dispatch('counter', 'set', 123456789)
		getState('counter').then(state => {
			expect(state).to.be(123456789)
			done()
		})
	})

	it('Execute action crossed to multiple stores by manager', function (done) {
		operate('countUpMessage', 1)
		stores.counter.subscribe(state => {
			expect(state).to.be(123456789 + 1)
		})
		stores.message.unsubscribe()
		stores.message.subscribe(state => {
			expect(state).to.be('1 has been added to the counter')
			done()
		})
	})
})
