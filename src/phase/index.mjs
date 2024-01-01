import getBundlerInformation from "../lib/getBundlerInformation.mjs"

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

	for (const phase of phases) {
		print(
			`${phase.icon} ${colorize("white.bold", phase.title + " phase")}\n`
		)

		print("\n")
		await phase.run(project)
		print("\n")
	}

	let color = "green"

	if (project.state.warnings.length) {
		color = "yellow"

		printWarnings(project.state.warnings)

		print(
			colorize("yellow.bold", `⚠️  Bundling complete, but make sure to read the warnings above\n`)
		)
	} else {
		print(
			colorize("green.bold", `✅ Bundling complete with no warnings\n`)
		)
	}

	let n_files = 0

	n_files += project.state.files.autogenerate.length
	n_files += project.state.files.build.length

	let time = (performance.now() - project.start) / 1000

	print(
		`\n` +
		colorize(color, `    Generated ${n_files} files in ${round(time)} second(s)`) +
		`\n\n`
	)
}
