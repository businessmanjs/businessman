import observable from 'riot-observable'

const o = new function () {
    observable( this )
}

export let trigger = function ( store ) {
    try {
        o.trigger( store.type, store.state )
    } catch ( e ) {
        console.error( e )
    }
}

export let on = function ( store, cb ) {
    try {
        o.on( store.type, cb )
    } catch ( e ) {
        console.error( e )
    }
}
