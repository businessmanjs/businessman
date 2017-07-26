import {pack} from './util'
import {GET_ALL_STATE} from './types/api'

export default stores => {
	const state = {}
	const key = Object.keys(stores)
	for (let i = 0; i < key.length; i++) {
		state[key[i]] = stores[key[i]].getState()
	}
	postMessage(pack({type: GET_ALL_STATE, payload: state, allState: true}))
	return state
}
