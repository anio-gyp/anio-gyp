import path from "node:path"
import print from "../../lib/print.mjs"

import {
	createDirTreeFromListSync
} from "@anio-jsbundler/utilities"

export default {
	title: "Tree generation",
	icon: "🌳",

	async run(project) {
		createDirTreeFromListSync(
			path.join(project.root, "src", "auto"), project.state.files.autogenerate
		)

		createDirTreeFromListSync(
			path.join(project.root, "build"), project.state.files.build
		)
	}
}
