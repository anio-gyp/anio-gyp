import path from "node:path"
import print from "../../lib/print.mjs"
import fs from "node:fs/promises"

import {colorize} from "@anio-gyp/utilities"

import nodeFsUtils from "@anio-node-foundation/fs-utils"

export default {
	id: "hk",
	title: "Housekeeping",
	icon: "🧹",

	async run(project) {
		if (!project.flags["remove"]) {
			print(`    Skipping because of -no-remove\n`)

			return
		}

		if (!project.state.files.remove.length) {
			print(colorize("gray", `    No files to remove!\n`))

			return
		}

		for (const file of project.state.files.remove) {
			const absolute_file_path = path.resolve(
				project.root, file
			)

			const type = await nodeFsUtils.isRegularDirectory(absolute_file_path) ? "dir" : "file"

			print(`    Remove out of date ${type.padEnd(4, " ")} ${file}\n`)

			await nodeFsUtils.remove(absolute_file_path)
		}
	}
}
