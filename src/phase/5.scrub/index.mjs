import print from "../../lib/print.mjs"
import path from "node:path"
import fs from "node:fs/promises"

import {colorize} from "@anio-gyp/utilities"

export default {
	title: "Scrubbing",
	icon: "🧼",

	async run(project) {
		if (!project.flags["scrub"]) {
			print(`    Skipping because of -no-scrub\n`)

			return
		}

		for (const file of project.state.files.scrub) {
			print(`    Scrub ${colorize("gray", file)}\n`)

			const absolute_file_path = path.join(
				project.root, file
			)

			await fs.writeFile(
				absolute_file_path, "stop\n"
			)
		}

	}
}
