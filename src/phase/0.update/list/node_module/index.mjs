import path from "node:path"

export default {
	label: "Node Integration",

	async run(project) {
		const runtime_root = path.join(
			project.root,
			"node_modules",
			"@anio-gyp",
			"project"
		)

		let files = ["virtual.mjs", "node.mjs"]

		//console.log(runtime_root)
	}
}
