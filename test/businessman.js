var businessman = businessman || {}

describe( 'businessman specs', function () {

    var stores

    it( 'Install Worker', function ( done ) {
        businessman.subscribe( 'create_client_store', ( data ) => {
            stores = data
            expect( data ).to.be.ok()
            done()
        } )
        businessman.install( '/dist/sample-worker.js' )
    } )

    it( 'Store for clients includes dispatch() and subscribe()', function () {
        for ( let store in stores ) {
            expect( stores[ store ] ).to.have.property( 'dispatch' )
            expect( stores[ store ] ).to.have.property( 'subscribe' )
            expect( stores[ store ].dispatch ).to.be.an( 'function' )
            expect( stores[ store ].subscribe ).to.be.an( 'function' )
        }
    } )

    it( 'Dispatch and subscribe from the client store', function ( done ) {
        stores.counter.dispatch( 'increment', 12345 )
        stores.counter.subscribe( function ( state ) {
            expect( state ).to.be( 12345 )
        } )
        stores.message.dispatch( 'update', 'This is a test' )
        stores.message.subscribe( function ( state ) {
            expect( state ).to.be( 'This is a test' )
            done()
        } )
    } )

} )
