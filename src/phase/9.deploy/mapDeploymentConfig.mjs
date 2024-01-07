export default function(config) {
	let ret = {}

	for (const key in config) {
		const value = config[key]

		if (Array.isArray(value) && value[0] === "env") {
			const env_name = value[1]

			if (!(env_name in process.env)) {
				throw new Error(`Required environment variable '${env_name}' not set.`)
			}

			ret[key] = process.env[env_name]
		} else {
			ret[key] = value
		}
	}

	return ret
}
