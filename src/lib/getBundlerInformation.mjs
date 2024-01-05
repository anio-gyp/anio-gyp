import fs from "node:fs/promises"
import {createRequire} from "node:module"

import getBundlerPackageJSON from "./getBundlerPackageJSON.mjs"

const require = createRequire(import.meta.url)

async function readJSONFile(file) {
	let str = (await fs.readFile(file)).toString()

	return JSON.parse(str)
}

async function getVersionOfDependency(dependency) {
	const package_json = await readJSONFile(
		// module must export "package.json" for this to work!
		require.resolve(`@anio-jsbundler/${dependency}/package.json`)
	)

	return package_json.version
}

export default async function() {
	const package_json = await getBundlerPackageJSON()

	return {
		bundler: {
			version: package_json.version,
			utilities: await getVersionOfDependency("utilities")
		},
		runtime: {
			version: await getVersionOfDependency("project")
		}
	}
}
