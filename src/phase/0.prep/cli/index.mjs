import {colorize} from "@anio-jsbundler/utilities"

import print from "../../../lib/print.mjs"

import bundleCLIFile from "../../../lib/project_type_appcli/build/bundleCLIFile.mjs"

export default async function(project) {
	const {state} = project

	state.files.build.push(["cli.mjs", bundleCLIFile])
}
