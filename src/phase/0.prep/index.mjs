import print from "../../lib/print.mjs"

import runLibrary from "./lib/index.mjs"
import addSupportFiles from "./addSupportFiles.mjs"
import scanDirectories from "./scanDirectories.mjs"
import findBundledResources from "./findBundledResources.mjs"
import calculateBundleID from "./calculateBundleID.mjs"

import {colorize} from "@anio-jsbundler/utilities"

export default {
	title: "Preparation",
	icon: "📝",

	async run(project) {
		if (project.config.type === "lib") {
			await runLibrary(project)
		}

		await addSupportFiles(project)

		const n_auto_gen = project.state.files.autogenerate.length
		const n_build    = project.state.files.build.length

		print(
			`    Files to auto-generate      ${colorize("gray", `${n_auto_gen} files will be auto-generated`)}\n` +
			`    Files to build              ${colorize("gray", `${n_build} files will be built`)}\n\n`
		)

		await scanDirectories(project)

		project.state.files.scrub = [
			...project.state.files.autogenerate.map(x => `src/auto/${x[0]}`),
			...project.state.files.build.map(x => `build/${x[0]}`)
		]

		await findBundledResources(project)

		// bundle id is calculated last because
		// this function reads project.state.bundle.resources
		await calculateBundleID(project)
	}
}
