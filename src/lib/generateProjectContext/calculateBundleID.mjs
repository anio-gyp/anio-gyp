import {
	isRegularDirectorySync,
	calcFileHash,
	scandirSync
} from "@anio-jsbundler/utilities/fs"

import {calcStringHash} from "@anio-jsbundler/utilities"

import path from "node:path"

export default async function(project) {
	let files_to_hash = []
	const src_files = scandirSync(
		path.join(project.root, "src")
	)

	files_to_hash.push({
		relative_path: "package.json",
		absolute_path: path.resolve(project.root, "package.json")
	})

	files_to_hash.push({
		relative_path: "anio_project.mjs",
		absolute_path: path.resolve(project.root, "anio_project.mjs")
	})

	for (const {type, relative_path, absolute_path} of src_files) {
		if (type === "dir") continue
		// ignore auto-generated files
		if (relative_path.startsWith("auto/")) continue

		files_to_hash.push({
			relative_path,
			absolute_path
		})
	}

	const resources_dir = path.join(project.root, "bundle.resources")

	if (isRegularDirectorySync(resources_dir)) {
		const resources = scandirSync(resources_dir)

		for (const {type, relative_path, absolute_path} of resources) {
			if (type === "dir") continue

			files_to_hash.push({
				relative_path,
				absolute_path
			})
		}
	}

	// sort files for stable hash
	files_to_hash.sort((a, b) => {
		return a.relative_path.localeCompare(b.relative_path)
	})

	let hashes = []

	for (const {relative_path, absolute_path} of files_to_hash) {
		if (path.basename(relative_path) === ".DS_Store") continue

		// use relative_path for hash table to ensure stable hash
		// across different locations
		hashes.push(
			`${relative_path}:${await calcFileHash(absolute_path)}`
		)
	}

	return await calcStringHash(hashes.join(","))
}
