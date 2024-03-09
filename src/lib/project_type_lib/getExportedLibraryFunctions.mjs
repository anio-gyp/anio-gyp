import getJavaScriptFilesRecursively from "./getJavaScriptFilesRecursively.mjs"
import convertFilePathToExportName from "./convertFilePathToExportName.mjs"
import filterReservedNames from "./filterReservedNames.mjs"

import {stripSuffix} from "@anio-gyp/utilities"
import nodeFsUtils from "@anio-node-foundation/fs-utils"

export default async function(project) {
	let javascript_files = await getJavaScriptFilesRecursively(project)

	let entries = [], index = {}

	for (const javascript_file of javascript_files) {
		let canonical_path = javascript_file

		if (canonical_path.endsWith("Factory.mjs")) {
			canonical_path = stripSuffix(canonical_path, "Factory.mjs")
		} else {
			canonical_path = stripSuffix(canonical_path, ".mjs")
		}

		const canonical_name = convertFilePathToExportName(canonical_path)

		// if both function and factory are specified
		// index will contain canonical_path
		if (!(canonical_path in index)) {
			entries.push({
				canonical_path,
				canonical_name
			})

			// save index to disable autogeneration
			// (because both function and factory exist already)
			index[canonical_path] = entries.length - 1
		} else {
			const entry_index = index[canonical_path]

			entries[entry_index].autogen = null

			project.state.warnings.push({
				id: "lib.duplicate_export",
				data: {
					canonical_path,
					canonical_name
				}
			})
		}
	}

	let library = []

	for (const entry of entries) {
		if (entry.autogen === null) {
			library.push({...entry})

			continue
		}

		const factory_path = `${project.root}/src/export/${entry.canonical_path}Factory.mjs`

		const factory_exists = await nodeFsUtils.isRegularFile(factory_path)

		library.push({
			...entry,
			autogen: factory_exists ? "function" : "factory"
		})
	}

	return filterReservedNames(project, library)
}
