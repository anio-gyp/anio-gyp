import path from "node:path"
import fs from "node:fs/promises"
import runBundler from "../../bundler/index.mjs"

export default {
	label: "app:cli:bundleCLIFile",

	async run(project, relative_path) {
		const absolute_path = path.join(project.root, "build", relative_path)

		await runBundler(project, {
			entry: "src/cli.mjs",
			output: `build/${relative_path}.tmp`
		})

		const app_source = await fs.readFile(`${absolute_path}.tmp`)
		let final_source = ""

		let bundled_resources = "This app does not include any bundled resources."

		if (project.state.bundle.resources !== null) {
			bundled_resources = "This app has the following resources embedded:\n\n"

			const longest_resource_path = Math.max.apply(null, Object.keys(project.state.bundle.resources).map(key => key.length))

			for (const resource in project.state.bundle.resources) {
				const bytes = project.state.bundle.resources[resource].length

				bundled_resources += `    ${resource.padEnd(longest_resource_path, " ")} : ${bytes} byte(s)\n`
			}
		}

		final_source  = `#!/usr/bin/env -S node --experimental-detect-module\n`
		final_source += `await (async () => {
	const process = await import("node:process")

	if (process.argv.length !== 3) {
		return
	} else if (process.argv[2] !== "--anio-gyp-info") {
		return
	}

	const meta = JSON.parse(${JSON.stringify(JSON.stringify(project.meta))})

	process.stderr.write(\`Created with anio-gyp version \${meta.bundler.version}.\\n\`)
	process.stderr.write(\`Bundle id is ${project.state.bundle.id.hash}.\\n\`)

	process.stderr.write(\`\\n\`)

	process.stderr.write(${JSON.stringify(bundled_resources)} + "\\n")

	process.exit()
})();

`
		final_source += app_source

		await fs.writeFile(absolute_path, final_source)

		await fs.unlink(`${absolute_path}.tmp`)
	}
}
