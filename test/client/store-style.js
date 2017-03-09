import { install, subscribe } from '../../index'
import { time, timeEnd, timeAverage, reset } from '../time'

describe( 'Businessman Store Style Specs', () => {
	var stores
	let initialize = false

	before( () => {
		reset()
	} )

	beforeEach( done => {
		let i = 0
		const counterSubscriber = state => {
			console.log( 'counter', timeEnd( 'counter' ) )
			i++
			stores.counter.unsubscribe()
			if ( state === 0 && i === 2 ) {
				done()
			}
		}
		const messageSubscriber = state => {
			console.log( 'message', timeEnd( 'message' ) )
			i++
			stores.message.unsubscribe()
			if ( state === '' && i === 2 ) {
				done()
			}
		}
		if ( initialize ) {
			stores.counter.subscribe( counterSubscriber )
			time( 'counter' )
			stores.counter.dispatch( 'set', 0 )
			stores.message.subscribe( messageSubscriber )
			time( 'message' )
			stores.message.dispatch( 'set', '' )
		} else {
			done()
		}
	} )

	afterEach( () => {
		if ( initialize ) {
			stores.counter.unsubscribe()
			stores.message.unsubscribe()
		}
	} )

	after( () => {
		console.log( 'Average', timeAverage() )
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
		stores.counter.dispatch( 'increment', 1 )
		stores.counter.subscribe( ( state, applied ) => {
			expect( state ).to.be( 1 )
			expect( applied ).to.be( 'increment' )
		} )
		stores.message.dispatch( 'set', 'This is a test' )
		stores.message.subscribe( ( state, applied ) => {
			expect( state ).to.be( 'This is a test' )
			expect( applied ).to.be( 'set' )
			done()
		} )
	} )

	it( 'If the third argument of commit is false it will not provide state', done => {
		stores.counter.dispatch( 'silentSet', 1 )
		stores.counter.subscribe( ( state, applied ) => {
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
		stores.counter.subscribe( counterSubscriber )
		stores.counter.dispatch( 'increment' )
		setTimeout( () => {
			stores.counter.unsubscribe( counterSubscriber )
			stores.counter.dispatch( 'increment' )
			expect( i ).to.be( 1 )
			done()
		}, 500 )
	} )

	it( 'Get store state', done => {
		stores.counter.dispatch( 'set', 123456 )
		stores.counter.getState().then( state => {
			expect( state ).to.be( 123456 )
			done()
		} )
	} )

	it( 'Get store state by getters', done => {
		stores.message.dispatch( 'set', 'This is a test' )
		stores.message.getState( 'wordCount' ).then( state => {
			expect( state ).to.be( 14 )
			done()
		} )
	} )
} )
