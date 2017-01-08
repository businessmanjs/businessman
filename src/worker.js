import Store from './store/store'
import { pack } from './util'
import { INIT } from './behavior-types'

let stores = {}
let managers = {}
let getters = {}
let forClient = {
	stores: [],
	managers: [],
	getters: []
}

const worker = {
	start: () => {
		onmessage = e => {
			const data = e.data
			switch ( data[ 0 ] ) {
				case 'dispatch':
					stores[ data[ 1 ] ].dispatch( data[ 2 ], data[ 3 ] )
					break
				case 'operate':
					managers[ data[ 1 ] ]( stores, data[ 2 ] )
					break
				case 'getState':
					stores[ data[ 1 ] ].getState( data[ 2 ], data[ 3 ] )
					break
				default:
					break
			}
		}
		postMessage( pack( { type: INIT, payload: { stores: forClient.stores, managers: forClient.managers, getters: forClient.getters } } ) )
	},
	registerStore: config => {
		const store = new Store( config )
		const {
            type,
            actions
        } = store
		if ( !( type in stores ) ) {
			stores[ type ] = store
			forClient.stores.push( {
				type: type,
				actions: Object.keys( actions ),
				getters: Object.keys( getters )
			} )
		}
	},
	registerManager: config => {
		const {
            type,
            handler
        } = config
		if ( !( type in managers ) ) {
			managers[ type ] = handler
			forClient.managers.push( {
				type: type
			} )
		}
	}
}

export default Object.freeze( worker )
