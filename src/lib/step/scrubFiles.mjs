import path from "node:path"
import fs from "node:fs/promises"

import {colorize} from "@anio-jsbundler/utilities"

export default async function(options, project) {
	for (const [file] of project.files_to_autogenerate) {
		const file_path = path.join(
			project.root, "src", "auto", file
		)

		//process.stderr.write(
		//	colorize("gray", `scrubbing '${file}'\n`)
		//)

		await fs.writeFile(
			file_path, `/* If you can see this comment something went wrong during bundling */\n`
		)
	}
}
