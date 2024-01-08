import print from "../../lib/print.mjs"
import deployment_targets from "./deploy_to/index.mjs"
import mapDeploymentConfig from "./mapDeploymentConfig.mjs"

import path from "node:path"
import fs from "node:fs/promises"

import {colorize} from "@anio-gyp/utilities"

function round(value) {
	return (Math.round(value * 1000) / 1000).toFixed(3)
}

function arrayify(value) {
	if (Array.isArray(value)) return value

	return [value]
}

function longestDeployTitle(targets) {
	let lengths = []

	for (const {to} of targets) {
		const label = deployment_targets[to].label

		lengths.push(label.length)
	}

	return Math.max.apply(null, lengths)
}

export default {
	id: "deploy",
	title: "Deploying",
	icon: "🚀",

	async run(project) {
		if (!project.flags["deploy"]) {
			print(`    Skipping because -deploy was not specified\n`)

			return
		} else if (!("deployment" in project.config)) {
			print(
				colorize("gray", "    No deployment configured!\n")
			)

			return
		}

		const targets = arrayify(project.config.deployment)

		const pad_to = longestDeployTitle(targets)

		for (const target of targets) {
			const {label, run, default_config} = deployment_targets[target.to]

			print(`    Deploy ${colorize("gray", label.padEnd(pad_to, " "))} `)

			const start = performance.now()

			await run(project, mapDeploymentConfig(
				Object.assign({}, default_config, target.config)
			))

			let time = performance.now() - start

			print(round(time).toString().padStart(7) + "ms\n")
		}
	}
}
