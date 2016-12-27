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

export let on = function ( type, cb ) {
    try {
        o.on( type, cb )
    } catch ( e ) {
        console.error( e )
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
