import path from "node:path"
import print from "../../lib/print.mjs"

import {
	colorize,
	determineObsoleteFilesFromListSync
} from "@anio-jsbundler/utilities"

export default async function(project) {
	const remove_src_auto_list = determineObsoleteFilesFromListSync(
		path.join(project.root, "src", "auto"), project.state.files.autogenerate
	).map(entry => `src/auto/${entry}`)

	print(
		`    Scan of src/auto            ${colorize("gray", `Found ${remove_src_auto_list.length} out of date files or folders`)}\n`
	)

	const remove_build_list = determineObsoleteFilesFromListSync(
		path.join(project.root, "build"), project.state.files.build
	).map(entry => `build/${entry}`)

	print(
		`    Scan of build               ${colorize("gray", `Found ${remove_build_list.length} out of date files or folders`)}\n`
	)

	project.state.files.remove = [
		...remove_src_auto_list,
		...remove_build_list
	]
}
