import path from "node:path"
import fs from "node:fs/promises"

import getAutoFileComment from "../../getAutoFileComment.mjs"

import {
	IdentifierGenerator
} from "@anio-jsbundler/utilities"

import {
	groupedImport,
	namedExports,
	defaultExportObject
} from "@anio-jsbundler/utilities/codegenerator"

export default {
	label: "lib:createSubModuleFile",

	async run(project, file_path, additional_options) {
		const generator = new IdentifierGenerator()

		const {submodule} = additional_options

		const absolute_file_path = path.join(
			project.root, "build", file_path
		)

		const {library_functions} = project.state.contextual_data

		let source_code = ""
		let grouped_import = []
		let named_exports = []
		let default_export = []

		let push = (canonical_name, fn_name) => {
			grouped_import.push({
				key: canonical_name,
				value: generator.insert(canonical_name)
			})

			named_exports.push({
				key: fn_name,
				value: generator.lookup(canonical_name)
			})

			default_export.push({
				key: fn_name,
				value: generator.lookup(canonical_name)
			})
		}

		source_code += await getAutoFileComment()

		for (const fn of library_functions) {
			if (!fn.canonical_path.startsWith(`${submodule}/`)) continue

			const fn_name = fn.canonical_name.slice(submodule.length + 1)

			push(fn.canonical_name, fn_name)
			push(fn.canonical_name + "Factory", fn_name + "Factory")
		}

		source_code += groupedImport("../library.mjs", grouped_import)
		source_code += "\n\n"
		source_code += namedExports(named_exports)
		source_code += "\n"
		source_code += defaultExportObject(default_export)
		source_code += "\n"

		await fs.writeFile(
			absolute_file_path, source_code
		)
	}
}
