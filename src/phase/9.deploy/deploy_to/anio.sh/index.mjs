import nodeFsUtils from "@anio-node-foundation/fs-utils"

import {
	parseRawHTTPResponse
} from "@anio-gyp/utilities/http"

import {execFileSync} from "child_process"
import path from "node:path"

export default async function(project, deploy_config) {
	const {
		deploy_url,
		auth_key,
		file_name,
		release_version
	} = deploy_config

	const absolute_binary_path = path.join(
		project.root, "build", "cli.mjs"
	)

	if (!nodeFsUtils.isRegularFile.sync(absolute_binary_path)) {
		throw new Error(`No binary to publish!`)
	}

	let result = execFileSync(
		"curl", [
			"-i",
			"--request", "POST",
			"--data-binary", `@${absolute_binary_path}`,
			"-H", "Content-Type:application/octet-stream",
			"-H", `x-anio-auth-key: ${auth_key}`,
			"-H", `x-anio-file-name: ${file_name}`,
			"-H", `x-anio-release-version: ${release_version}`,
			deploy_url
		], {
			stdio: "pipe"
		}
	)

	result = parseRawHTTPResponse(`${result}`)

	if (result.code !== 200) {
		throw new Error(`HTTP Status Code: ${result.code}`)
	}
}
