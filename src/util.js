import observable from 'riot-observable'

const o = new function () {
    observable( this )
}

export let trigger = function ( data ) {
    try {
        o.trigger( data.type, data.payload )
    } catch ( e ) {
        console.error( e )
    }
}

export let on = function ( data, cb ) {
    try {
        o.on( data.type, cb )
    } catch ( e ) {
        console.error( e )
    }
}
