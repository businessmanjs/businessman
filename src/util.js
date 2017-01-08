import observable from 'riot-observable'

const o = new function () {
	observable( this )
}()

export const trigger = function ( data ) {
	o.trigger( data.type, data.payload, data.mutation, data.getter )
}

export const on = function ( type, cb ) {
	o.on( type, cb )
}

export const off = function ( type, cb ) {
	if ( cb ) {
		o.off( type, cb )
	} else {
		o.off( type )
	}
}

export const pack = function ( options ) {
	const {
		type = null,
		payload = null,
		mutation = null,
		getter = null
	} = options
	return { type: type, payload: payload, mutation: mutation, getter: getter }
}

export const assign = function ( target, sources ) {
	try {
		return Object.assign( target, sources )
	} catch ( err ) {
		let keys = Object.keys( sources )
		for ( let i = 0; i < keys.length; i++ ) {
			let key = keys[ i ]
			if ( !( key in target ) ) {
				target[ key ] = sources[ key ]
			}
		}
		return target
	}
}
