import bundler from "../bundler/index.mjs"

import {colorize} from "@anio-jsbundler/utilities"

export default async function(options, project) {
	if (!("bundler" in project.context)) {
		return
	}

	process.stderr.write(
		colorize("white.bold", "📦 Bundler") + "\n\n"
	)

	await bundler(options, project)

	const {entry, output} = project.context.bundler

	process.stderr.write(
		`    Created ${output} from ${entry}\n`
	)

	process.stderr.write("\n")
}
