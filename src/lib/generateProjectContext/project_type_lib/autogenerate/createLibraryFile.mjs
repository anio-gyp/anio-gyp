import {IdentifierGenerator} from "@anio-jsbundler/utilities"
import {namedExports} from "@anio-jsbundler/utilities/codegenerator"

function importStatement(alias, path){
	return `import ${alias} from ${JSON.stringify(path)}\n`
}

function addFunction(fn, generator) {
	let ret = ""

	const fn_name = fn.canonical_name
	const fn_path = "../export/" + fn.canonical_path + ".mjs"

	const fn_factory_name = fn.canonical_name + "Factory"
	const fn_factory_path = "../export/" + fn.canonical_path + "Factory.mjs"

	// null means use imported user defined function
	let fn_source = null, fn_factory_source = null

	// auto-generate factory
	if (fn.autogen === "factory") {
		const fn_id = generator.insert(fn_name)
		ret += importStatement(fn_id, fn_path)

		fn_factory_source = `function ${fn_name}Factory(new_context) { return ${fn_id}; }`
	}
	// auto-generate function
	else if (fn.autogen === "function") {
		const fn_factory_id = generator.insert(fn_factory_name)
		ret += importStatement(fn_factory_id, fn_factory_path)

		fn_source = fn_factory_id + "(_module_default_context)"
	}
	// both function and factory were specified by user
	else if (fn.autogen === null) {
		const fn_id = generator.insert(fn_name)
		const fn_factory_id = generator.insert(fn_factory_name)

		ret += importStatement(fn_id, fn_path)
		ret += importStatement(fn_factory_id, fn_factory_path)
	}

	if (fn_source === null) {
		fn_source = generator.lookup(fn_name)
	}

	if (fn_factory_source === null) {
		fn_factory_source = generator.lookup(fn_factory_name)
	}

	let named_exports = [{
		key: fn_name,
		value: `wrapFunction("${fn_name}", ${fn_source})`
	}, {
		key: fn_factory_name,
		value: `wrapFactory("${fn_name}", ${fn_factory_source})`
	}]

	return ret + namedExports(named_exports, {
		pad_to_longest_key: false
	})
}

export default async function(project) {
	const {library_functions} = project.context

	let src = ``

	src += `import wrapFactory from "./util/wrapFactory.mjs"
import wrapFunction from "./util/wrapFunction.mjs"
import {createDefaultContextAsync} from "@anio-jsbundler/project"

`

	src += `/* Module's default context */
const _module_default_context = await createDefaultContextAsync()

export function getUsedDefaultContext() {
	return _module_default_context
}

`
	let generator = new IdentifierGenerator()

	for (const fn of library_functions) {
		src += `/* ${fn.canonical_path} */\n`
		src += addFunction(fn, generator)
		src += "\n"
	}

	return src.slice(0, src.length - 1)
}
