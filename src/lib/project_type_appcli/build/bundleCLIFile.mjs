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

		final_source  = `#!/usr/bin/env -S node --experimental-detect-module\n`
		final_source += app_source

		await fs.writeFile(absolute_path, final_source)

		await fs.unlink(`${absolute_path}.tmp`)
	}
}
