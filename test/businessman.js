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

} )
