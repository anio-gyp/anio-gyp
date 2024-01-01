import print from "../../lib/print.mjs"
import {colorize} from "@anio-jsbundler/utilities"

export default {
	title: "Reporting",
	icon: "🔍",

	async run(project) {
		print(`    The following files will be updated or created:\n`)
		print("\n")

		const l1 = Math.max.apply(null, project.state.files.autogenerate.map(x => {
			return x[0].length
		}))

		const l2 = Math.max.apply(null, project.state.files.build.map(x => {
			return x[0].length
		}))

		const offset = Math.max(l1, l2) + 2

		for (const file of project.state.files.autogenerate) {
			const generator = file[1].label

			print(`        ${("src/auto/" + file[0]).padEnd(offset + 9)} ${colorize("gray", generator)}\n`)
		}

		for (const file of project.state.files.build) {
			const generator = file[1].label

			print(`        ${"build/" + (file[0]).padEnd(offset + 3)} ${colorize("gray", generator)}\n`)
		}

		print("\n")
		print(`    The following files will be included in the bundle:\n`)
		print("\n")

		if (project.state.bundle.resources === null) {
			print(colorize("gray", "        No files will be included.\n"))
		} else {
			for (const resource in project.state.bundle.resources) {
				print(`        bundle.resources/${resource}\n`)
			}
		}

		const {hash} = project.state.bundle.id

		print("\n")
		print(`    The bundle id was calculated to be : ${colorize("gray", hash)}\n`)
	}
}
