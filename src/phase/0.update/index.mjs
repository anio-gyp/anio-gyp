import print from "../../lib/print.mjs"
import {colorize} from "@anio-gyp/utilities"
import determineFilesToUpdate from "./determineFilesToUpdate.mjs"

import npmInstall from "./strategy/npmInstall.mjs"
import writeFile from "./strategy/writeFile.mjs"

function longestFilePath(files) {
	return Math.max.apply(null, files.map(file => {
		return file.path.length
	}))
}

export default {
	title: "Update",
	icon: "⚡",

	async run(project) {
		if (!project.flags["update"]) {
			print(`    Skipping because -update was not specified\n`)

			return
		}

		const files = await determineFilesToUpdate(project)

		if (!files.length) {
			print(`    All project files are up to date.\n`)

			return
		}

		print(`    The following files are deemed outdated and will be updated:\n\n`)

		const offset = longestFilePath(files)

		for (const file of files) {
			const {strategy, data} = file.update

			print(`        ${file.path.padEnd(offset, " ")} -> v${file.version} ${colorize("gray", `[${strategy}]`)}\n`)

			const ctx = {
				path: file.path,
				data
			}

			switch (strategy) {
				case "npmInstall": {
					await npmInstall(project, ctx)
				} break

				case "writeFile": {
					await writeFile(project, ctx)
				} break

				default: {
					throw new Error(`Invalid update strategy '${strategy}'.`)
				}
			}
		}
	}
}
