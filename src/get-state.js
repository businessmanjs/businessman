import {on, off} from './util'
import {GETTER} from './types/observer'
import {GET_STATE} from './types/api'

let id = 0
const list = []

export default (storeType, getter = 'default', options, worker) => {
	return new Promise((resolve, reject) => {
		id++
		const subscriber = (id, getter) => {
			return (state, _, got, _id) => {
				if (_id !== id || got !== getter) {
					return
				}
				const index = list.findIndex(l => l.id === id)
				if (index > -1) {
					const o = list[index]
					off(storeType, o.listener, GETTER)
					list.splice(o, 1)
					resolve(state)
				}
			}
		}
		const listener = subscriber(id, getter)
		list.push({id, listener})

		on(storeType, listener, GETTER)

		try {
			worker.postMessage([GET_STATE, storeType, getter, options, id])
		} catch (err) {
			off(storeType, subscriber, GETTER)
			reject(err)
		}
	})
}
