import fs from "node:fs/promises"
import {createRequire} from "node:module"

import getBundlerPackageJSON from "./getBundlerPackageJSON.mjs"

async function readJSONFile(file) {
	let str = (await fs.readFile(file)).toString()

	return JSON.parse(str)
}

async function getVersionOfDependency(context, dependency) {
	const require = createRequire(context)

	const package_json = await readJSONFile(
		// module must export "package.json" for this to work!
		require.resolve(`@anio-gyp/${dependency}/package.json`)
	)

	return package_json.version
}

export default async function(project) {
	const package_json = await getBundlerPackageJSON()

	return {
		bundler: {
			version: package_json.version,
			utilities: await getVersionOfDependency(import.meta.url, "utilities")
		},
		runtime: {
			version: await getVersionOfDependency(project.root + "/anio_project.mjs", "project")
		}
	}
}
