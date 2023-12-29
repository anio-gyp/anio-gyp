import {IdentifierGenerator} from "@anio-jsbundler/utilities"

import {
	groupedImport,
	defaultExportObject
} from "@anio-jsbundler/utilities/codegenerator"

export default async function(project) {
	const {library_functions} = project.context

	let src = ""

	const generator = new IdentifierGenerator()

	let grouped_import = [], default_export = []

	for (const fn of library_functions) {
		grouped_import.push({
			key: fn.canonical_name,
			value: generator.insert(fn.canonical_name)
		})

		grouped_import.push({
			key: fn.canonical_name + "Factory",
			value: generator.insert(fn.canonical_name + "Factory")
		})

		default_export.push({
			key: fn.canonical_path + ".mjs",
			value: generator.lookup(fn.canonical_name)
		})

		default_export.push({
			key: fn.canonical_path + "Factory.mjs",
			value: generator.lookup(fn.canonical_name + "Factory")
		})
	}

	src += groupedImport("./library.mjs", grouped_import, {
		additional_padding: 5
	})

	src += "\n\n"
	src += defaultExportObject(default_export)
	src += "\n"

	return src
}
