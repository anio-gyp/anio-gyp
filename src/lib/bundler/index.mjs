import print from "../print.mjs"

import {rollup} from "rollup"
import resolve from "@rollup/plugin-node-resolve"
import rollupPluginFactory from "./plugin.mjs"
import path from "node:path"
import fs from "node:fs/promises"

export default async function(options, project) {
	const {entry, output} = project.context.bundler

	const plugin = rollupPluginFactory({
		/* build context */
		// bundle id
		bundle_id: project.bundle_id,
		short_bundle_id: project.short_bundle_id,
		// bundle.resources
		bundled_resources: project.bundled_resources,
		bundler_meta: project.bundler_meta,
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
		 * to resolve "@anio-jsbundler/project" to a ''virtual'' module
		 * to support loading resources seamlessly
		 */
		plugins: [plugin(), resolve()],

		onLog(level, error, handler) {
			print(
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
