import fs from "node:fs/promises"
import path from "node:path"

import {
	makeGETRequest
} from "@anio-gyp/utilities/http"

import {
	calcStringHash
} from "@anio-gyp/utilities"

export default async function(project) {
	let newest = await makeGETRequest(`https://anio.sh/github_cicd.yaml.sha256`)
	let current = await calcStringHash(
		await fs.readFile(
			path.join(project.root, ".github", "workflows", "cicd.yaml")
		), "sha256"
	)

	if (newest !== current) {
		project.state.files.update.push([
			".github/workflows/cicd.yaml", {
				label: "..",
				run() {}
			}
		])
	}
}
