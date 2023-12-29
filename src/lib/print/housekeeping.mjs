import {colorize} from "@anio-jsbundler/utilities"

function printFilesToBeRemoved(project) {
	if (!project.files_to_remove.length) {
		process.stderr.write(
			colorize("gray", "        No files will be removed\n")
		)
		return
	}

	for (const f of project.files_to_remove) {
		process.stderr.write(
			`        ${colorize("gray", `- src/auto/${f}`)}\n`
		)
	}
}

function printFilesToBeScrubbed(project) {
	if (!project.files_to_autogenerate.length) {
		process.stderr.write(
			colorize("gray", "        No files will be auto-generated\n")
		)
		return
	}

	for (const f of project.files_to_autogenerate) {
		process.stderr.write(
			`        ${colorize("gray", `- src/auto/${f[0]}`)}\n`
		)
	}
}

export default async function(options, project) {
	process.stderr.write(
		colorize("white.bold", "🧹 Housekeeping") + "\n\n"
	)

	process.stderr.write(
		`    🗑️  The following files will be removed:\n\n`
	)

	printFilesToBeRemoved(project)
	process.stderr.write("\n")

	process.stderr.write(
		`    🧼 The folllowing files will be auto-generated, they need scrubbing:\n\n`
	)

	printFilesToBeScrubbed(project)
	process.stderr.write("\n")
}
