const valid_options = {
	"--update-root-url": "https://anio.sh/anio-gyp/"
}

const valid_flags = [
	"-update",
	"-force-update",
	"-no-scrub",
	"-no-remove",
	"-no-autogen",
	"-no-build",
	"-tests",
	"-tests-only",
	"-deploy",
	"-collapsed"
]

export default function(args) {
	let flags_obj = {}
	let options_obj = {}

	for (const flag of valid_flags) {
		if (flag.startsWith("-no-")) {
			flags_obj[flag.slice(4)] = true
		} else {
			flags_obj[flag.slice(1)] = false
		}
	}

	for (const option in valid_options) {
		options_obj[option.slice(2)] = valid_options[option]
	}

	while (true) {
		if (!args.length) break

		const arg = args.shift()

		if (arg.startsWith("--")) {
			if (!(arg in valid_options)) {
				throw new Error(`Unknown option ${arg}`)
			}

			if (!args.length) {
				throw new Error(`Value required for ${arg}`)
			}

			options_obj[arg.slice(2)] = args.shift()
		} else if (arg.startsWith("-")) {
			if (!valid_flags.includes(arg)) {
				throw new Error(`Unknown flag ${arg}`)
			}

			if (arg.startsWith("-no-")) {
				flags_obj[arg.slice(4)] = false
			} else {
				flags_obj[arg.slice(1)] = true
			}
		} else {
			throw new Error(`anio-gyp does not take any more operands (operand '${arg}').`)
		}
	}

	return {
		flags: flags_obj,
		options: options_obj
	}
}
