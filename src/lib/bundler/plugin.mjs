// Code is based off of https://rollupjs.org/plugin-development/#a-simple-example
import fs from "node:fs/promises"
import path from "node:path"
import {fileURLToPath} from "node:url"
import {createRequire} from "node:module"

const require = createRequire(import.meta.url)

const __dirname = path.dirname(
	fileURLToPath(import.meta.url)
)

async function loadVirtualModule(build_context) {
	const build_context_str = JSON.stringify(
		JSON.stringify(build_context)
	)

	const bundle_runtime_src = require.resolve(
		`@anio-jsbundler/project/dist/virtual.mjs`
	)

	let virtual_module = (
		await fs.readFile(bundle_runtime_src)
	).toString()

	virtual_module = virtual_module.split("`$build_context$`")
	virtual_module = virtual_module.join(build_context_str)

	return virtual_module
}

export default function(build_context) {
	return function anioJSBundlerResolverPlugin() {
		return {
			name: "anio-jsbundler-resolver-plugin",

			resolveId(source) {
				if (source === "@anio-jsbundler/project") {
					// this signals that Rollup should not ask other plugins or check
					// the file system to find this id
					return source
				}
				// refuse to resolve @anio-jsbundler/runtime
				else if (source === "@anio-jsbundler/runtime") {
					throw new Error(`Please do not use '@anio-jsbundler/runtime' imports anymore. Use @anio-jsbundler/project instead.`)
				}

				return null // other ids should be handled as usually
			},

			async load(id) {
				if (id === "@anio-jsbundler/project") {
					return await loadVirtualModule(build_context)
				}

				return null // other ids should be handled as usually
			}
		}
	}
}
