import fs from "node:fs/promises"
import path from "node:path"

import {
	calcStringHash
} from "@anio-gyp/utilities"

import {
	scandirSync,
	calcFileHash
} from "@anio-gyp/utilities/fs"

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

		hashes.push(
			`${file}:${await calcFileHash(absolute_path)}`
		)
	}

	const n_hashed_files = hashes.length

	const hash = await calcStringHash(
		hashes.join(",\n")
	)

	project.state.bundle.id = {
		n_hashed_files,
		hash,
		short: hash.slice(0, 4) + ".." + hash.slice(hash.length - 4)
	}
}
