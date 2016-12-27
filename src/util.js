import observable from 'riot-observable'

const o = new function () {
    observable( this )
}

export let trigger = function ( data ) {
    try {
        o.trigger( data.type, data.payload )
    } catch ( e ) {
        console.error( 'Error in trigger', e )
    }
}

export let on = function ( type, cb ) {
    try {
        o.on( type, cb )
    } catch ( e ) {
        console.error( 'Error in on', e )
    }
}

export let off = function ( type, cb ) {
    try {
        if ( cb ) o.off( type, cb )
        else o.off( type )
    } catch ( e ) {
        console.error( 'Error in off', e )
    }
}

export let pack = function ( type, payload ) {
    return { type: type, payload: payload }
}

export let defineFreezeProperties = function ( target, name, value ) {
    return Object.defineProperties( target, {
        [ name ]: {
            value: value,
            enumerable: false,
            writable: false,
            configurable: false
        }
    } )
}
