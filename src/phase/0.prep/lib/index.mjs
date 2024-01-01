import path from "node:path"

import {colorize} from "@anio-jsbundler/utilities"

import getExportedLibraryFunctions from "../../../lib/project_type_lib/getExportedLibraryFunctions.mjs"
import print from "../../../lib/print.mjs"

import createLibraryFile from "../../../lib/project_type_lib/autogenerate/createLibraryFile.mjs"
import createDictionaryFile from "../../../lib/project_type_lib/autogenerate/createDictionaryFile.mjs"
import createImportFile from "../../../lib/project_type_lib/autogenerate/createImportFile.mjs"
import createIndexFile from "../../../lib/project_type_lib/autogenerate/createIndexFile.mjs"
import createNoticeFile from "../../../lib/project_type_lib/autogenerate/createNoticeFile.mjs"

import bundleLibraryFile from "../../../lib/project_type_lib/build/bundleLibraryFile.mjs"
import createSubModuleFile from "../../../lib/project_type_lib/build/createSubModuleFile.mjs"

function getSubModules(library_functions) {
	let ret = {}

	for (const fn of library_functions) {
		const dirname = path.dirname(fn.canonical_path)

		if (dirname === ".") continue

		const depth = dirname.split("/").length

		if (depth > 1) continue

		ret[dirname] = 1
	}

	return Object.keys(ret)
}

export default async function(project) {
	const {state} = project
	const library_functions = await getExportedLibraryFunctions(project)

	// sort functions for consistent result
	library_functions.sort((a, b) => {
		return a.canonical_name.localeCompare(b.canonical_name)
	})

	state.files.autogenerate.push(["library.mjs", createLibraryFile])
	state.files.autogenerate.push(["dict.mjs", createDictionaryFile])
	state.files.autogenerate.push(["importWithContextAsync.mjs", createImportFile])
	state.files.autogenerate.push(["index.mjs", createIndexFile])
	state.files.autogenerate.push(["NOTICE.txt", createNoticeFile, {autogen_warning_comment: false}])

	state.files.build.push(["library.mjs", bundleLibraryFile])

	const submodules = getSubModules(library_functions)

	for (const submodule of submodules) {
		state.files.build.push([`submodule/${submodule}.mjs`, createSubModuleFile, {submodule}])
	}

	let submodules_str = ""

	if (submodules.length) {
		submodules_str = ` (${submodules.join(", ")})`
	}

	const n_exports = library_functions.length
	const n_submods = submodules.length

	print(
		`    Scan of src/export            ${colorize("gray", `Found ${n_exports} exports and ${n_submods} sub-modules${submodules_str}`)}\n`
	)

	state.contextual_data = {library_functions}
}
