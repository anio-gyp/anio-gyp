import {rollup} from "rollup"
import resolve from "@rollup/plugin-node-resolve"
import rollupPluginFactory from "./plugin.mjs"
import path from "node:path"
import fs from "node:fs/promises"
import getBundlerInformation from "./getBundlerInformation.mjs"

export default async function(options, project) {
	const {entry, output} = project.context.bundler

	const plugin = rollupPluginFactory({
		/* build context */
		// bundle id
		bundle_id: project.bundle_id,
		short_bundle_id: project.short_bundle_id,
		// bundle.resources
		bundled_resources: project.bundled_resources,
		bundler_meta: await getBundlerInformation(),
		package_json: project.package_json,
		anio_project_config: project.config
	})

	const rollup_options = {
		input: entry,

		output: {
			file: output,
			format: "es"//,
			//inlineDynamicImports: true
		},

		/**
		 * custom plugin has the responsibility
		 * to resolve "@anio-jsbundler/runtime" to a ''virtual'' module
		 * to support loading resources seamlessly
		 */
		plugins: [plugin(), resolve()],

		onLog(level, error, handler) {
			process.stderr.write(
				`[${level}] ${error.message}\n`
			)
		}
	}

	let cwd = process.cwd()

	//
	// needed for rollup-node-resolve plugin
	//
	process.chdir(project.root)

	try {
		const bundle = await rollup(rollup_options)

		await bundle.write(rollup_options.output)
	} finally {
		process.chdir(cwd)
	}
}
