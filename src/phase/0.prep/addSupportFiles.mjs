import {
	isRegularDirectorySync,
	scandirSync
} from "@anio-jsbundler/utilities/fs"

import path from "node:path"
import fs from "node:fs/promises"
import {fileURLToPath} from "node:url"

const __dirname = path.dirname(
	fileURLToPath(import.meta.url)
)

export default async function(project) {
	const type = project.config.type

	const support_files_dir = path.join(
		__dirname, "..", "..", "lib", `project_type_${type}`, "support_files"
	)

	if (!isRegularDirectorySync(support_files_dir)) return

	const files = scandirSync(support_files_dir)

	for (const file of files) {
		if (file.type === "dir") continue

		let generator = {
			label: "lib:copySupportFile [synthetic]",
			async run(project, file_path, additional_options) {
				return await fs.readFile(
					additional_options.source
				)
			}
		}

		project.state.files.autogenerate.push([
			`support_files/${file.relative_path}`, generator, {
				source: file.absolute_path
			}
		])
	}
}
