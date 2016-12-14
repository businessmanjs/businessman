import o from 'obseriot'

var businessman = {}

Object.defineProperties( businessman, {
    goodmorning: {
        value: function ( e = {}, cb ) {
            o.listen( e, cb )
        },
        enumerable: false,
        writable: false,
        configurable: false
    },
    hello: {
        value: function ( e = {}, ...arg ) {
            o.notify( e, arg )
        },
        enumerable: false,
        writable: false,
        configurable: false
    },
    goodnight: {
        value: function ( e = {}, cb ) {
            if ( cb ) o.remove( e, cb )
            else o.remove( e )
        },
        enumerable: false,
        writable: false,
        configurable: false
    },
    sheep: {
        value: function ( e = {}, cb ) {
            o.once( e, cb )
        },
        enumerable: false,
        writable: false,
        configurable: false
    }
} )

export default businessman
