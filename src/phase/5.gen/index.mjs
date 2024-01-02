import print from "../../lib/print.mjs"
import getAutoFileComment from "../../lib/getAutoFileComment.mjs"

import path from "node:path"
import fs from "node:fs/promises"

import {colorize} from "@anio-jsbundler/utilities"

export default {
	title: "Generation",
	icon: "⚙️ ",

	async run(project) {
		if (!project.flags["autogen"]) {
			print(`    Skipping because of -no-autogen\n`)

			return
		}

		for (const entry of project.state.files.autogenerate) {
			const [relative_path, source_generator] = entry
			const additional_options = entry.length === 3 ? entry[2] : {}
			let add_warning_comment = true

			if ("autogen_warning_comment" in additional_options) {
				add_warning_comment = additional_options.autogen_warning_comment
			}

			print(`    Generate ${colorize("gray", `src/auto/${relative_path}`)}\n`)

			let source_code = ``

			if (add_warning_comment) {
				source_code += await getAutoFileComment()
			}

			source_code += await source_generator.run(
				project, relative_path, additional_options
			)

			await fs.writeFile(
				path.join(project.root, "src", "auto", relative_path),
				source_code
			)
		}
	}
}
