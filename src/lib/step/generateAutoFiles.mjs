import path from "node:path"
import fs from "node:fs/promises"

import {colorize} from "@anio-jsbundler/utilities"
import getAutoFileComment from "../getAutoFileComment.mjs"

export default async function(options, project) {
	process.stderr.write(
		colorize("white.bold", "⚙️  Auto Generation") + "\n\n"
	)

	for (const file of project.files_to_autogenerate) {
		const [file_path, generator] = file

		let contents = await getAutoFileComment()

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
