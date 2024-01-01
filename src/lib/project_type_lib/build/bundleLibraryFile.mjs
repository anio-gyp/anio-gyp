import runBundler from "../../bundler/index.mjs"

export default {
	label: "lib:bundleLibraryFile",

	async run(project, relative_path) {
		await runBundler(project, {
			entry: "src/auto/index.mjs",
			output: `build/${relative_path}`
		})
	}
}
