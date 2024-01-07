import fs from "node:fs/promises"
import path from "node:path"

import getUpdateURLForFile from "./getUpdateURLForFile.mjs"

import {makeGETRequest} from "@anio-gyp/utilities/http"
import {calcStringHash} from "@anio-gyp/utilities"

function parseVersionNumber(str) {
	const [major, minor, bug] = str.split(".").map(x => parseInt(x, 10))

	return (major * 100) + (minor * 10) + (bug * 1)
}

async function check(project, file_path) {
	const current_hash = await calcStringHash(
		await fs.readFile(path.join(project.root, file_path)), "sha256"
	)

	const request_url = await getUpdateURLForFile(project, file_path)
	const response_body = await makeGETRequest(request_url)
	const response = JSON.parse(response_body)

	const was_changed = !(current_hash in response.hashmap)

	if (was_changed && !project.flags["force-update"]) {
		project.state.warnings.push({
			id: "update.changed_file",
			data: file_path
		})

		return null
	}

	// just use latest version
	if (was_changed) {
		const {version, update} = response.current

		project.state.warnings.push({
			id: "update.force_updated",
			data: {
				file: file_path,
				to_version: version
			}
		})

		return {
			path: file_path,
			version,
			update
		}
	}

	const current_version = parseVersionNumber(response.hashmap[current_hash])
	const newest_version = parseVersionNumber(response.current.version)

	if (newest_version > current_version) {
		const {version, update} = response.current

		return {
			path: file_path,
			version,
			update
		}
	}

	return null
}

export default async function(project, file_path) {
	try {
		return await check(project, file_path)
	} catch (error) {
		project.state.warnings.push({
			id: "update.unable_to_check",
			data: {
				file: file_path,
				error: error.message
			}
		})
	}

	return null
}
