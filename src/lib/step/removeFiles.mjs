import path from "node:path"
import fs from "node:fs/promises"

import {colorize} from "@anio-jsbundler/utilities"
import {
	isRegularDirectorySync,
	isRegularFileSync,
	removeDirectorySync
} from "@anio-jsbundler/utilities/fs"

export default async function(options, project) {
	for (const file of project.files_to_remove) {
		const file_path = path.join(project.root, "src", "auto", file)

		//print(
		//	colorize("gray", `removing '${file}'\n`)
		//)

		if (isRegularDirectorySync(file_path)) {
			removeDirectorySync(file_path)
		} else if (isRegularFileSync(file_path)) {
			await fs.unlink(file_path)
		}
	}
}
