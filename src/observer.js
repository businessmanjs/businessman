let callbacks = {}

const observable = {
	register: name => {
		callbacks[name] = {}
	},
	on: (name, type, cb) => {
		const list = callbacks[name]
		if (type in list) {
			list[type].push(cb)
		} else {
			list[type] = [cb]
		}
	},
	off: (name, type, cb) => {
		const list = callbacks[name]
		if (cb) {
			const i = list[type].indexOf(cb)
			if (i) {
				list[type].splice(i, 1)
			}
		} else {
			list[type] = []
		}
	},
	trigger: (name, type, ...args) => {
		const list = callbacks[name]
		const cbs = list[type]
		if (cbs) {
			for (let i = 0; i < cbs.length; i++) {
				cbs[i](...args)
			}
		}
	}
}

export default observable
