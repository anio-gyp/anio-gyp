import getBundlerPackageJSON from "../../getBundlerPackageJSON.mjs"

export default {
	label: "lib:createVersionFile",

	async run(project) {
		const package_json = await getBundlerPackageJSON()

		return `Exact anio-jsbundler version used: ${package_json.version}\n`
	}
}
