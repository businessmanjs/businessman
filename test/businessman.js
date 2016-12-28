import businessman from '../src/businessman'

describe( 'businessman specs', function () {

    var stores

    it( 'Install Worker', function ( done ) {
        businessman.subscribe( 'CREATE_CLIENT_STORE', ( data ) => {
            stores = data
            expect( data ).to.be.ok()
            done()
        } )
        businessman.install( '/dist/test-worker.js' )
    } )

    it( 'Store for clients includes dispatch() and subscribe()', function () {
        expect( stores ).to.be.ok()
        let storeKeys = Object.keys( stores )
        for ( let i = 0; i < storeKeys.length; i++) {
            let store = storeKeys[ i ]
            expect( stores[ store ] ).to.have.property( 'dispatch' )
            expect( stores[ store ] ).to.have.property( 'subscribe' )
            expect( stores[ store ].dispatch ).to.be.an( 'function' )
            expect( stores[ store ].subscribe ).to.be.an( 'function' )
        }
    } )

    it( 'Dispatch and subscribe from the client store', function ( done ) {
        stores.counter.dispatch( 'increment', 1 )
        stores.counter.subscribe( function ( state ) {
            expect( state ).to.be( 1 )
        } )
        stores.message.dispatch( 'update', 'This is a test' )
        stores.message.subscribe( function ( state ) {
            expect( state ).to.be( 'This is a test' )
            done()
        } )
    } )

    it( 'Unsubscribe from the client store', function ( done ) {
        stores.counter.unsubscribe()
        let i = 0,
            counterSubscriber = function () {
                i++
            }
        stores.counter.subscribe( counterSubscriber )
        stores.counter.dispatch( 'increment' )
        setTimeout( function () {
            stores.counter.unsubscribe( counterSubscriber )
            stores.counter.dispatch( 'increment' )
            expect( i ).to.be( 1 )
            done()
        }, 500 )
    } )

    it( 'Dispatch and subscribe from the Businessman', function ( done ) {
        businessman.dispatch( 'counter', 'increment', 1 )
        businessman.subscribe( 'counter', function ( state ) {
            expect( state ).to.be( 4 )
        } )
        businessman.dispatch( 'message', 'update', 'This is a test' )
        businessman.subscribe( 'message', function ( state ) {
            expect( state ).to.be( 'This is a test' )
            done()
        } )
    } )

    it( 'Unsubscribe from the client Businessman', function ( done ) {
        businessman.unsubscribe( 'counter' )
        let i = 0,
            counterSubscriber = function () {
                i++
            }
        businessman.subscribe( 'counter', counterSubscriber )
        businessman.dispatch( 'counter', 'increment' )
        setTimeout( function () {
            businessman.unsubscribe( 'counter', counterSubscriber )
            businessman.dispatch( 'counter', 'increment' )
            expect( i ).to.be( 1 )
            done()
        }, 500 )
    } )

} )
