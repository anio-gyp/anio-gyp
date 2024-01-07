import print from "../../lib/print.mjs"
import list from "./list/index.mjs"
import {colorize} from "@anio-gyp/utilities"

export default {
	title: "Update",
	icon: "⚡",

	async run(project) {
		if (!project.flags["update"]) {
			print(`    Skipping because of -no-update\n`)

			return
		}

		/*
		for (const {label, run} of list) {
			print(`    Check ${colorize("gray", label)} `)

			await run(project)

			print(`\n`)
		}

		const files = project.state.files.update

		if (!files.length) return

		print("\n")
		print(`    The following files are deemed outdated and should be updated:\n\n`)

		for (const file of files) {
			print(`        ${file[0]}\n`)
		}
		*/
	}
}
