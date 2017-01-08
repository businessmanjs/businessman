import { install, dispatch, operate, subscribe, unsubscribe, getState } from '../../src/businessman'

describe( 'Businessman Default Style Specs', () => {
	var stores
	let initialize = false

	beforeEach( done => {
		let i = 0
		const counterSubscriber = state => {
			i++
			if ( state === 0 && i === 2 ) {
				unsubscribe( 'counter' )
				done()
			}
		}
		const messageSubscriber = state => {
			i++
			if ( state === '' && i === 2 ) {
				unsubscribe( 'message' )
				done()
			}
		}
		if ( initialize ) {
			unsubscribe( 'counter' )
			unsubscribe( 'message' )
			dispatch( 'counter', 'set', 0 )
			dispatch( 'message', 'set', '' )
			subscribe( 'counter', counterSubscriber )
			subscribe( 'message', messageSubscriber )
		} else {
			done()
		}
	} )

	it( 'Install Worker', done => {
		subscribe( 'CREATE_CLIENT_STORE', data => {
			stores = data
			initialize = true
			expect( data ).to.be.ok()
			done()
		} )
		install( '/dist/test-worker.js' )
	} )

	it( 'Store for clients includes dispatch() and subscribe()', () => {
		expect( stores ).to.be.ok()
		let storeKeys = Object.keys( stores )
		for ( let i = 0; i < storeKeys.length; i++ ) {
			let store = storeKeys[ i ]
			expect( stores[ store ] ).to.have.property( 'dispatch' )
			expect( stores[ store ] ).to.have.property( 'subscribe' )
			expect( stores[ store ].dispatch ).to.be.an( 'function' )
			expect( stores[ store ].subscribe ).to.be.an( 'function' )
		}
	} )

	it( 'Dispatch and subscribe', done => {
		dispatch( 'counter', 'increment', 1 )
		subscribe( 'counter', ( state, applied ) => {
			expect( state ).to.be( 1 )
			expect( applied ).to.be( 'increment' )
		} )
		dispatch( 'message', 'set', 'This is a test' )
		subscribe( 'message', ( state, applied ) => {
			expect( state ).to.be( 'This is a test' )
			expect( applied ).to.be( 'set' )
			done()
		} )
	} )

	it( 'If the third argument of commit is false it will not provide state', done => {
		dispatch( 'counter', 'silentSet', 1 )
		subscribe( 'counter', ( state, applied ) => {
			expect( state ).to.be( null )
			expect( applied ).to.be( 'set' )
			done()
		} )
	} )

	it( 'Unsubscribe', done => {
		let i = 0
		let counterSubscriber = () => {
			i++
		}
		subscribe( 'counter', counterSubscriber )
		dispatch( 'counter', 'increment' )
		setTimeout( () => {
			unsubscribe( 'counter', counterSubscriber )
			dispatch( 'counter', 'increment' )
			expect( i ).to.be( 1 )
			done()
		}, 500 )
	} )

	it( 'Get store state', done => {
		dispatch( 'counter', 'set', 123456 )
		getState( 'counter' ).then( state => {
			expect( state ).to.be( 123456 )
			done()
		} )
	} )

	it( 'Get store state by getters', done => {
		dispatch( 'message', 'set', 'This is a test' )
		getState( 'message', 'wordCount' ).then( state => {
			expect( state ).to.be( 14 )
			done()
		} )
	} )

	it( 'Execute action crossed to multiple stores by manager', done => {
		operate( 'countUpMessage', 1 )
		subscribe( 'counter', state => {
			expect( state ).to.be( 1 )
		} )
		unsubscribe( 'message' )
		subscribe( 'message', state => {
			expect( state ).to.be( '1 has been added to the counter' )
			done()
		} )
	} )
} )
