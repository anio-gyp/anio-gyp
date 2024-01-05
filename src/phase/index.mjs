import getBundlerInformation from "../lib/getBundlerInformation.mjs"

import prep_phase from "./1.prep/index.mjs"
import report_phase from "./2.report/index.mjs"
import hk_phase from "./3.hk/index.mjs"
import tree_phase from "./4.tree/index.mjs"
import scrub_phase from "./5.scrub/index.mjs"
import gen_phase from "./6.gen/index.mjs"
import build_phase from "./7.build/index.mjs"
import print from "../lib/print.mjs"

import {colorize} from "@anio-jsbundler/utilities"

import printWarnings from "./printWarnings.mjs"

const phases = [
	prep_phase,
	report_phase,
	hk_phase,
	tree_phase,
	scrub_phase,
	gen_phase,
	build_phase
]

function round(value) {
	return (Math.round(value * 1000) / 1000).toFixed(3)
}

export default async function(project) {
	project.meta = await getBundlerInformation()

	project.state = {
		bundle: {
			id: null,
			resources: null
		},

		warnings: [],

		contextual_data: {},

		files: {
			autogenerate: [],
			build: [],
			remove: [],
			scrub: []
		}
	}

	let collapsed_output = project.flags.collapsed

	for (const phase of phases) {
		if (collapsed_output) {
			print(`${phase.icon} ${colorize("white", phase.title)}\n`)
		} else {
			print(`${phase.icon} ${colorize("white.bold", phase.title + " phase")}\n`)
		}

		if (collapsed_output) print.disable()

		print("\n")

		await phase.run(project)

		print("\n")

		if (collapsed_output) print.enable()
	}

	let color = "green"
	let time = (performance.now() - project.start) / 1000

	if (project.state.warnings.length) {
		color = "yellow"

		printWarnings(project.state.warnings)

		print(
			colorize("yellow.bold", `⚠️  Done in ${round(time)} seconds with warnings, make sure to read the warnings above\n`)
		)
	} else {
		print(
			colorize("green.bold", `✅ Done in ${round(time)} seconds with no warnings\n`)
		)
	}
}
