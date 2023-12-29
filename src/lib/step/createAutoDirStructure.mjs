import path from "node:path"
import fs from "node:fs/promises"

import {colorize} from "@anio-jsbundler/utilities"
import {
	isRegularDirectorySync
} from "@anio-jsbundler/utilities/fs"

export default async function(options, project) {
	for (const [file] of project.files_to_autogenerate) {
		const file_path = path.join(
			project.root, "src", "auto", file
		)

		const file_dir_path = path.dirname(file_path)

		if (!isRegularDirectorySync(file_dir_path)) {
			//process.stderr.write(
			//	colorize("gray", `creating dir 'src/auto/${path.dirname(file)}'\n`)
			//)

			await fs.mkdir(file_dir_path, {
				recursive: true
			})
		}
	}
}
