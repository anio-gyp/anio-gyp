import fs from "node:fs/promises"
import path from "node:path"

import {
	scandirSync,
	isRegularDirectorySync
} from "@anio-jsbundler/utilities/fs"

export default async function(project) {
	let bundle_resources = null

	const bundle_resources_path = path.join(project.root, "bundle.resources")

	if (isRegularDirectorySync(bundle_resources_path)) {
		const bundle_resources_folder = scandirSync(bundle_resources_path)

		const bundle_resources_files = bundle_resources_folder.filter(entry => {
			return entry.type === "file"
		}).map(entry => {
			return entry.relative_path
		})

		bundle_resources = {}

		for (const file of bundle_resources_files) {
			bundle_resources[file] = (await fs.readFile(
				path.join(project.root, "bundle.resources", file)
			)).toString()
		}
	}

	project.state.bundle.resources = bundle_resources
}
