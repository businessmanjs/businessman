class Observable {
	constructor () {
		let callbacks = {}

		Object.defineProperties( this, {
			on: {
				value: ( type, cb ) => {
					if ( type in callbacks ) {
						callbacks[ type ].push( cb )
					} else {
						callbacks[ type ] = [ cb ]
					}
				}
			},
			off: {
				value: ( type, cb ) => {
					if ( cb ) {
						const i = callbacks[ type ].indexOf( cb )
						if ( i ) {
							callbacks[ type ].splice( i, 1 )
						}
					} else {
						callbacks[ type ] = []
					}
				}
			},
			trigger: {
				value: ( type, ...args ) => {
					const cbs = callbacks[ type ]
					for ( let i = 0; i < cbs.length; i++ ) {
						cbs[ i ].apply( null, args )
					}
				}
			}
		} )
	}
}

export default Observable
