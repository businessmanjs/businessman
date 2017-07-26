import {DISPATCH} from './types/api'

export default (storeType, actionType, payload, worker) => {
	worker.postMessage([DISPATCH, storeType, actionType, payload])
}
