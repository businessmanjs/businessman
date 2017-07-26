import observer from './observer'
import {GETTER, CLIENT, ALLSTATE} from './types/observer'

observer.register(GETTER)
observer.register(CLIENT)
observer.register(ALLSTATE)

export const trigger = function (data, obs = CLIENT) {
	observer.trigger(obs, data.type, data.payload, data.mutation, data.getter)
}

export const on = function (type, cb, obs = CLIENT) {
	observer.on(obs, type, cb)
}

export const off = function (type, cb, obs = CLIENT) {
	if (cb) {
		observer.off(obs, type, cb)
	} else {
		observer.off(obs, type)
	}
}

export const pack = function (options) {
	const {
		type = null,
		payload = null,
		mutation = null,
		getter = null,
		allState = null
	} = options
	return {type: type, payload: payload, mutation: mutation, getter: getter, allState: allState}
}

export const assign = function (target, sources) {
	try {
		return Object.assign(target, sources)
	} catch (err) {
		let keys = Object.keys(sources)
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i]
			if (!(key in target)) {
				target[key] = sources[key]
			}
		}
		return target
	}
}
