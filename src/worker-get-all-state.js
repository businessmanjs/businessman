import { pack } from './util'

export default stores => {
	const state = {}
	const key = Object.keys( stores )
	for ( let i = 0; i < key.length; i++ ) {
		state[ key[ i ] ] = stores[ key[ i ] ].getState()
	}
	postMessage( pack( { type: 'getAllState', payload: state, allState: true } ) )
	return state
}
