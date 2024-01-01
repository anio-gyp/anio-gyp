import {IdentifierGenerator} from "@anio-jsbundler/utilities"

import {
	groupedImport,
	namedExports,
	defaultExportObject
} from "@anio-jsbundler/utilities/codegenerator"

export default {
	label: "lib:createIndexFile",

	async run(project) {
		const {library_functions} = project.state.contextual_data

		const generator = new IdentifierGenerator()

		let src = ""

		let grouped_import = [], named_exports = [], default_export = []

		src += `import ${generator.insert("dict")} from "./dict.mjs"\n`
		src += `import ${generator.insert("importWithContextAsync")} from "./importWithContextAsync.mjs"\n`

		let push = (o, imp = true) => {
			if (imp) grouped_import.push(o)
			named_exports.push(o)
			default_export.push(o)
		}

		push("Generic library exports")

		push({
			key: "dict",
			value: generator.lookup("dict")
		}, false)

		push({
			key: "importWithContextAsync",
			value: generator.lookup("importWithContextAsync")
		}, false)

		push({
			key: "getUsedDefaultContext",
			value: generator.insert("getUsedDefaultContext")
		})

		push("User defined library functions")

		for (const fn of library_functions) {
			push({
				key: fn.canonical_name,
				value: generator.insert(fn.canonical_name)
			})

			push({
				key: fn.canonical_name + "Factory",
				value: generator.insert(fn.canonical_name + "Factory")
			})
		}

		src += "\n"
		src += groupedImport("./library.mjs", grouped_import, {
			additional_padding: 8
		})

		src += `\n`
		src += `\n`

		src += namedExports(named_exports)

		src += `\n`

		src += defaultExportObject(default_export, {
			additional_padding: 9
		})

		src += `\n`

		return src
	}
}
