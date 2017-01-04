import Store from './store/store'
import {pack} from './util'
import {INIT} from './behavior-types'

let stores = {}
let managers = {}
let forClient = {
	stores: [],
	managers: []
}

const worker = {
	start: () => {
		onmessage = e => {
			const data = e.data
			if (data.length > 2) {
				stores[data[0]].dispatch(data[1], data[2])
			}			else if (data.length > 1) {
				managers[data[0]](stores, data[1])
			}
		}
		postMessage(pack(INIT, {stores: forClient.stores, managers: forClient.managers}))
	},
	registerStore: config => {
		const store = new Store(config)
		const {
            type,
            actions
        } = store
		if (!(type in stores)) {
			stores[type] = store
			forClient.stores.push({
				type: type,
				actions: Object.keys(actions)
			})
		}
	},
	registerManager: config => {
		const {
            type,
            handler
        } = config
		if (!(type in managers)) {
			managers[type] = handler
			forClient.managers.push({
				type: type
			})
		}
	}
}

export default Object.freeze(worker)
