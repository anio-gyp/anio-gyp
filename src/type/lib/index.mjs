import bundler from "../../bundler/index.mjs"
import path from "node:path"

import {
	getExportedLibraryFunctions,
	determineFunctionsToAutoGenerate,
	generateAutoFunctions,
	pruneAutoFunctionsFolder,
	generateModuleIndex
} from "@anio-jsbundler/core"

export default async function(project) {
	const library_functions = await getExportedLibraryFunctions(project)

	const auto_gen = determineFunctionsToAutoGenerate(library_functions)

	const generated_files = await generateAutoFunctions(
		project,
		auto_gen
	)

	await pruneAutoFunctionsFolder(
		project, generated_files
	)

	await generateModuleIndex(project, {
		library_functions, auto_gen
	})

	await bundler(
		project, {
			entry: path.resolve(project.root, "src", "auto", "_index.mjs"),
			output: path.resolve(project.root, "build", "lib.mjs")
		}
	)
}
