import {on, off} from './util'
import {ALLSTATE} from './types/observer'
import {GET_ALL_STATE} from './types/api'

export default worker => {
	return new Promise((resolve, reject) => {
		const subscriber = state => {
			off(GET_ALL_STATE, subscriber, ALLSTATE)
			resolve(state)
		}

		on(GET_ALL_STATE, subscriber, ALLSTATE)

		try {
			worker.postMessage([GET_ALL_STATE])
		} catch (err) {
			off(GET_ALL_STATE, subscriber, ALLSTATE)
			reject(err)
		}
	})
}
