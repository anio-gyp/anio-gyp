import prep_phase from "./0.prep/index.mjs"
import report_phase from "./1.report/index.mjs"
import hk_phase from "./2.hk/index.mjs"
import tree_phase from "./3.tree/index.mjs"
import scrub_phase from "./4.scrub/index.mjs"
import gen_phase from "./5.gen/index.mjs"
import print from "../lib/print.mjs"

import {colorize} from "@anio-jsbundler/utilities"

import printWarnings from "./printWarnings.mjs"

const phases = [
	prep_phase,
	report_phase,
	hk_phase,
	tree_phase,
	scrub_phase,
	gen_phase
]

export default async function(project) {
	project.state = {
		warnings: [],

		contextual_data: {},

		files: {
			autogenerate: [],
			build: [],
			remove: [],
			scrub: []
		}
	}

	for (const phase of phases) {
		print(
			`${phase.icon} ${colorize("white.bold", phase.title + " phase")}\n`
		)

		print("\n")
		await phase.run(project)
		print("\n")
	}

	if (project.state.warnings.length) {
		printWarnings(project.state.warnings)

		print(
			colorize("yellow.bold", `⚠️  Bundling complete, but make sure to read the warnings above.\n`)
		)
	} else {
		print(
			colorize("green.bold", `✅ Bundling complete, no warnings.\n`)
		)
	}
}
