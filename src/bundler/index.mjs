import {rollup} from "rollup"
import resolve from "@rollup/plugin-node-resolve"
import rollupPluginFactory from "./plugin.mjs"
import path from "node:path"
import fs from "node:fs/promises"
import getBundlerInformation from "../getBundlerInformation.mjs"

import {
	calcBundleID,
	findBundledResources
} from "@anio-jsbundler/core"

export default async function(project, {entry, output}) {
	const bundle_id = await calcBundleID(project)
	const bundled_resources = await findBundledResources(
		project
	)

	const plugin = rollupPluginFactory({
		/* build context */
		// bundle id
		...bundle_id,
		// bundle.resources
		bundled_resources,
		bundler_meta: await getBundlerInformation(),
		package_json: project.package_json,
		anio_project_config: project.config
	})

	const options = {
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
		const bundle = await rollup(options)

		await bundle.write(options.output)
	} finally {
		process.chdir(cwd)
	}
}
