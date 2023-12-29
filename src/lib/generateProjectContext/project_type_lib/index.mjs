import getExportedLibraryFunctions from "./getExportedLibraryFunctions.mjs"

import createLibraryFile from "./autogenerate/createLibraryFile.mjs"
import createDictionaryFile from "./autogenerate/createDictionaryFile.mjs"
import createImportFile from "./autogenerate/createImportFile.mjs"
import createIndexFile from "./autogenerate/createIndexFile.mjs"


export default async function(project) {
	const library_functions = await getExportedLibraryFunctions(project)

	// make sure library_functions array is sorted
	// so that output code is stable
	library_functions.sort((a, b) => {
		return a.canonical_name.localeCompare(b.canonical_name)
	})

	project.files_to_autogenerate.push(["library.mjs", createLibraryFile])
	project.files_to_autogenerate.push(["dict.mjs", createDictionaryFile])
	project.files_to_autogenerate.push(["importWithContextAsync.mjs", createImportFile])
	project.files_to_autogenerate.push(["index.mjs", createIndexFile])

	return {
		library_functions,
		bundler: {
			entry: "src/auto/index.mjs",
			output: "build/library.mjs"
		}
	}
}
