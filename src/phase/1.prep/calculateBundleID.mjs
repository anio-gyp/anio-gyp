import fs from "node:fs/promises"
import path from "node:path"

import calcHashStr from "@anio-node-foundation/calc-hash-str"

import nodeFsUtils from "@anio-node-foundation/fs-utils"

import determineFilesToBeChecksummed from "./determineFilesToBeChecksummed.mjs"

export default async function(project) {
	let hashes = []
	const files = await determineFilesToBeChecksummed(project)

	// sort files for consistent result
	files.sort((a, b) => {
		return a.localeCompare(b)
	})

	for (const file of files) {
		const absolute_path = path.join(project.root, file)
		const file_hash = await nodeFsUtils.hashFile(absolute_path, "sha1")

		hashes.push(
			`${file}:${file_hash}`
		)
	}

	const n_hashed_files = hashes.length

	const hash = await calcHashStr(
		hashes.join(",\n"), "sha1"
	)

	project.state.bundle.id = {
		n_hashed_files,
		hash,
		short: hash.slice(0, 4) + ".." + hash.slice(hash.length - 4)
	}
}
