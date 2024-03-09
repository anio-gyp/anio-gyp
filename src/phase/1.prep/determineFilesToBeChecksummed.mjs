import fs from "node:fs/promises"
import path from "node:path"

import scandir from "@anio-node-foundation/fs-scandir"

export default async function(project) {
	let files_to_checksum = [
		"package.json",
		"anio_project.mjs"
	]

	if (project.config.type === "lib") {
		const source_folder = await scandir(
			path.join(project.root, "src")
		)

		const source_files = source_folder.filter(entry => {
			return entry.type === "file"
		}).map(entry => {
			return entry.relative_path
		}).filter(entry => {
			return !entry.startsWith("auto/")
		})

		for (const file of source_files) {
			files_to_checksum.push(`src/${file}`)
		}
	}

	if (project.state.bundle.resources !== null) {
		for (const resource in project.state.bundle.resources) {
			files_to_checksum.push(`bundle.resources/${resource}`)
		}
	}

	return files_to_checksum
}
