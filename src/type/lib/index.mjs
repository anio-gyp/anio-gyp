import bundler from "../../bundler/index.mjs"
import path from "node:path"

import {
	getExportedLibraryFunctions,
	generateModuleLibrary,
	generateModuleIndex,
	generateImportWithContextAsyncFn,
	generateModuleDictionary
} from "@anio-jsbundler/core"

export default async function(project) {
	const library_functions = await getExportedLibraryFunctions(project)

	// make sure library_functions array is sorted
	// so that output code is stable
	library_functions.sort((a, b) => {
		return a.canonical_name.localeCompare(b.canonical_name)
	})

	await generateModuleLibrary(project, library_functions)
	await generateModuleIndex(project, library_functions)
	await generateModuleDictionary(project, library_functions)
	await generateImportWithContextAsyncFn(project, library_functions)

	await bundler(
		project, {
			entry: path.resolve(project.root, "src", "auto", "index.mjs"),
			output: path.resolve(project.root, "build", "lib.mjs")
		}
	)
}
