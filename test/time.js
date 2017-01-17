const getTime = () => performance.now()

let t = {}

export const time = name => {
	t[ name ] = getTime()
}

export const timeEnd = name => {
	const ms = getTime() - t[ name ]
	return ( Math.floor( ms * 1000 ) / 1000 ) + 'ms'
}
