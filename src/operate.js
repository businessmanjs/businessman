import {OPERATE} from './types/api'

export default (managerType, payload, worker) => {
	worker.postMessage([OPERATE, managerType, payload])
}
