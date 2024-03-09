import fs from "node:fs/promises"
import path from "node:path"

import scandir from "@anio-node-foundation/fs-scandir"

import nodeFsUtils from "@anio-node-foundation/fs-utils"

export default async function(project) {
	let bundle_resources = null

	const bundle_resources_path = path.join(project.root, "bundle.resources")

	if (nodeFsUtils.isRegularDirectory.sync(bundle_resources_path)) {
		const bundle_resources_folder = await scandir(bundle_resources_path)

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
