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
		`@anio-gyp/project/dist/virtual.mjs`
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
			name: "anio-gyp-resolver-plugin",

			resolveId(source) {
				if (source === "@anio-gyp/project") {
					// this signals that Rollup should not ask other plugins or check
					// the file system to find this id
					return source
				}
				// refuse to resolve @anio-jsbundler/runtime
				else if (source === "@anio-jsbundler/runtime") {
					throw new Error(`Please do not use '@anio-jsbundler/runtime' imports anymore. Use @anio-gyp/project instead.`)
				}
				// refuse to resolve @anio-jsbundler/project
				else if (source === "@anio-jsbundler/project") {
					throw new Error(`Please do not use '@anio-jsbundler/project' imports anymore. Use @anio-gyp/project instead.`)
				}

				return null // other ids should be handled as usually
			},

			async load(id) {
				if (id === "@anio-gyp/project") {
					return await loadVirtualModule(build_context)
				}

				return null // other ids should be handled as usually
			}
		}
	}
}
