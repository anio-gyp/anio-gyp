import print from "../../lib/print.mjs"

import {colorize} from "@anio-gyp/utilities"

export default {
	id: "test",
	title: "Testing",
	icon: "🧪",

	async run(project) {
		if (!project.flags["tests"]) {
			print(`    Skipping because -tests was not specified\n`)

			return
		}
	}
}
