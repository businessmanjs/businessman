import observable from 'riot-observable'

const CLIENT = new function () {
	observable( this )
}()
const GETTER = new function () {
	observable( this )
}()
const observer = obs => {
	let target
	switch ( obs ) {
		case 'getter':
			target = GETTER
			break
		default:
			target = CLIENT
			break
	}
	return target
}

export const trigger = function ( data, obs ) {
	observer( obs ).trigger( data.type, data.payload, data.mutation, data.getter )
}

export const on = function ( type, cb, obs ) {
	observer( obs ).on( type, cb )
}

export const off = function ( type, cb, obs ) {
	if ( cb ) {
		observer( obs ).off( type, cb )
	} else {
		observer( obs ).off( type )
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
