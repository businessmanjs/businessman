import {trigger} from './util'
import {GETTER, CLIENT, ALLSTATE} from './types/observer'

export default (path, worker) => {
	try {
		worker = new Worker(path)
		worker.onmessage = m => trigger(m.data, (m.data.allState ? ALLSTATE : m.data.getter ? GETTER : CLIENT))
		return worker
	} catch (err) {
		console.error('Error in install', err)
	}
}
