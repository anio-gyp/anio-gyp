import print from "../../lib/print.mjs"
import getAutoFileComment from "../../lib/getAutoFileComment.mjs"

import path from "node:path"
import fs from "node:fs/promises"

import {colorize} from "@anio-jsbundler/utilities"

function round(value) {
	return (Math.round(value * 1000) / 1000).toFixed(3)
}

export default {
	title: "Building",
	icon: "🔨",

	async run(project) {
		if (!project.flags["build"]) {
			print(`    Skipping because of -no-build\n`)

			return
		}

		const build_offset = Math.max.apply(null, project.state.files.build.map(x => x[0].length)) + 6 + 4

		for (const entry of project.state.files.build) {
			const [relative_path, file_generator] = entry
			const additional_options = entry.length === 3 ? entry[2] : {}
			const start = performance.now()

			await file_generator.run(
				project, relative_path, additional_options
			)

			let time = performance.now() - start

			print(`    Build ${colorize("gray", `build/${relative_path}`.padEnd(build_offset))} ${round(time).toString().padStart(7)} ms\n`)
		}
	}
}
