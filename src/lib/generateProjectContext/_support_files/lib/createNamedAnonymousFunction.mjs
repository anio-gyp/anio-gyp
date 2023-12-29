/* Used to give a consistent name to the exported functions and wrapped factories */
export default function(name, fn) {
	let tmp = {
		[`${name}`](...args) {
			return fn(...args)
		}
	}

	return tmp[`${name}`]
}
