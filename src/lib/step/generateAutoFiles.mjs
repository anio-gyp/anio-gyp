import path from "node:path"
import fs from "node:fs/promises"

import {colorize} from "@anio-jsbundler/utilities"
import getAutoFileComment from "../getAutoFileComment.mjs"

export default async function(options, project) {
	process.stderr.write(
		colorize("white.bold", "⚙️  Auto Generation") + "\n\n"
	)

	for (const entry of project.files_to_autogenerate) {
		const [file_path, generator] = entry
		let file_options = entry.length === 3 ? entry[2] : {}
		let autogen_comment = true

		if ("append_autogen_comment" in file_options) {
			autogen_comment = file_options.autogen_comment
		}

		let contents = autogen_comment ? await getAutoFileComment() : ""

		contents += await generator(project, file_path)

		await fs.writeFile(
			path.join(project.root, "src", "auto", file_path), contents
		)

		process.stderr.write(
			colorize("gray", `    - src/auto/${file_path}`) + "\n"
		)
	}

	process.stderr.write("\n")
}
