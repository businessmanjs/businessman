import {pack} from './util'

export default (stores, data) => {
	const [
		store,
		type,
		payload,
		id
	] = data
	const get = stores[store].getState(type, payload)
	postMessage(pack({type: store, payload: get, getter: type, id}))
}
