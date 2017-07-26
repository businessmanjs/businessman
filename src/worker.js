import Store from './store/store'
import getState from './worker-get-state'
import getAllState from './worker-get-all-state'
import {pack} from './util'
import INIT from './types/built-in'
import {DISPATCH, OPERATE, GET_STATE, GET_ALL_STATE} from './types/api'

let stores = {}
let managers = {}

const worker = {
	start: () => {
		onmessage = e => {
			const data = e.data
			const c = data[0]
			data.shift()
			switch (c) {
				case DISPATCH:
					stores[data[0]].dispatch(data[1], data[2])
					break
				case OPERATE:
					managers[data[0]](stores, data[1])
					break
				case GET_STATE:
					getState(stores, data)
					break
				case GET_ALL_STATE:
					getAllState(stores)
					break
				default:
					break
			}
		}
		postMessage(pack({type: INIT, payload: {stores: Object.keys(stores), managers: Object.keys(managers)}}))
	},
	registerStore: config => {
		const store = new Store(config)
		const {
            type
        } = store
		if (!(type in stores)) {
			stores[type] = store
		}
	},
	registerManager: config => {
		const {
            type,
            handler
        } = config
		if (!(type in managers)) {
			managers[type] = handler
		}
	}
}

export default Object.freeze(worker)
