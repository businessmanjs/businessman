var businessman = businessman || {}

describe( 'businessman specs', function () {
    it( 'Install Worker', function ( done ) {
        businessman.subscribe( 'init', ( data ) => {
            expect( data ).to.be.ok()
            done()
        } )
        businessman.install( '/dist/sample-worker.js' )
    } )
} )
