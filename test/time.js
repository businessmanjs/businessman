const getTime = () => performance.now()
const floor = (n, d) => Math.floor(n * d) / d

let t = {}
let record = []

export const time = name => {
	t[name] = getTime()
}

export const timeEnd = name => {
	const ms = getTime() - t[name]
	record.push(ms)
	return floor(ms, 1000) + 'ms'
}

export const timeAverage = () => {
	const sum = record.reduce((p, c) => p + c)
	return floor(sum / record.length, 1000) + 'ms'
}

export const reset = () => {
	t = {}
	record = []
}
