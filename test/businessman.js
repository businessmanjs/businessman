import test from 'ava'
import {install, dispatch, operate, subscribe, unsubscribe, getState} from '../src/businessman'

var stores

test('Install Worker', t => {
	subscribe('CREATE_CLIENT_STORE', data => {
		stores = data
		t.truthy(data)
	})
	install('/dist/test-worker.js')
})

test('Store for clients includes dispatch() and subscribe()', t => {
	let storeKeys = Object.keys(stores)
	for (let i = 0; i < storeKeys.length; i++) {
		let store = storeKeys[i]
		t.true('dispatch' in stores[store])
		t.true('subscribe' in stores[store])
	}
})

test('Dispatch and subscribe from the client store', t => {
	stores.counter.dispatch('increment', 1)
	stores.counter.subscribe((state, applied) => {
		t.is(state, 1)
		t.is(applied, 'increment')
	})
	stores.message.dispatch('set', 'This is a test')
	stores.message.subscribe((state, applied) => {
		t.is(state, 'This is a test')
		t.is(applied, 'set')
	})
})

test('Unsubscribe from the client store', t => {
	stores.counter.unsubscribe()
	let i = 0
	let counterSubscriber = function () {
		i++
	}
	stores.counter.subscribe(counterSubscriber)
	stores.counter.dispatch('increment')
	setTimeout(() => {
		stores.counter.unsubscribe(counterSubscriber)
		stores.counter.dispatch('increment')
		t.is(i, 1)
	}, 500)
})

test('Get store state', t => {
	stores.counter.unsubscribe()
	stores.counter.dispatch('set', 123456)
	stores.counter.getState().then(state => {
		t.is(state, 123456)
	})
})

test('Dispatch and subscribe from the Businessman', t => {
	dispatch('counter', 'set', 0)
	setTimeout(() => {
		dispatch('counter', 'increment', 1)
		subscribe('counter', (state, applied) => {
			t.is(state, 1)
			t.is(applied, 'increment')
		})
		dispatch('message', 'set', 'This is a test')
		subscribe('message', (state, applied) => {
			t.is(state, 'This is a test')
			t.is(applied, 'set')
		})
	}, 500)
})

test('Unsubscribe from the Businessman', t => {
	unsubscribe('counter')
	let i = 0
	let counterSubscriber = () => {
		i++
	}
	subscribe('counter', counterSubscriber)
	dispatch('counter', 'increment')
	setTimeout(() => {
		unsubscribe('counter', counterSubscriber)
		dispatch('counter', 'increment')
		t.is(i, 1)
	}, 500)
})

test('Get store state from the Businessman', t => {
	unsubscribe('counter')
	dispatch('counter', 'set', 123456789)
	getState('counter').then(state => {
		t.is(state, 123456789)
	})
})

test('Execute action crossed to multiple stores by manager', t => {
	operate('countUpMessage', 1)
	stores.counter.subscribe(state => {
		t.is(state, 123456789 + 1)
	})
	stores.message.unsubscribe()
	stores.message.subscribe(state => {
		t.is(state, '1 has been added to the counter')
	})
})
