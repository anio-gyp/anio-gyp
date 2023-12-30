import print from "../print.mjs"
import bundler from "../bundler/index.mjs"

import {colorize} from "@anio-jsbundler/utilities"

export default async function(options, project) {
	if (!("bundler" in project.context)) {
		return
	}

	print(colorize("white.bold", "📦 Bundler") + "\n\n")

	await bundler(options, project)

	const {entry, output} = project.context.bundler

	print(`    Created ${output} from ${entry}\n`)
	print("\n")
}
