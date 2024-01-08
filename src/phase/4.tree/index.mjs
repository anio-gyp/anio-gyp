import path from "node:path"
import print from "../../lib/print.mjs"

import createDirTreeFromList from "./createDirTreeFromList.mjs"

export default {
	id: "tree",
	title: "Tree generation",
	icon: "🌳",

	async run(project) {
		await createDirTreeFromList(
			project,
			project.state.files.autogenerate.map(file => `src/auto/${file[0]}`)
		)

		await createDirTreeFromList(
			project,
			project.state.files.build.map(file => `build/${file[0]}`)
		)
	}
}
