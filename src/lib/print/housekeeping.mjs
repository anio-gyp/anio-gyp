import print from "../print.mjs"

import {colorize} from "@anio-jsbundler/utilities"

function printFilesToBeRemoved(project) {
	if (!project.files_to_remove.length) {
		print(
			colorize("gray", "        No files will be removed\n")
		)
		return
	}

	for (const f of project.files_to_remove) {
		print(
			`        ${colorize("gray", `- src/auto/${f}`)}\n`
		)
	}
}

function printFilesToBeScrubbed(project) {
	if (!project.files_to_autogenerate.length) {
		print(
			colorize("gray", "        No files will be auto-generated\n")
		)
		return
	}

	for (const f of project.files_to_autogenerate) {
		print(
			`        ${colorize("gray", `- src/auto/${f[0]}`)}\n`
		)
	}
}

export default async function(options, project) {
	print(colorize("white.bold", "🧹 Housekeeping") + "\n\n")

	print(`    🗑️  The following files will be removed:\n\n`)

	printFilesToBeRemoved(project)
	print("\n")

	print(`    🧼 The folllowing files will be auto-generated, they need scrubbing:\n\n`)

	printFilesToBeScrubbed(project)
	print("\n")
}
