import fs from "node:fs/promises"
import path from "node:path"
import {fileURLToPath} from "node:url"

const __dirname = path.dirname(
	fileURLToPath(import.meta.url)
)

async function readJSONFile(file) {
	let str = (await fs.readFile(file)).toString()

	return JSON.parse(str)
}

async function getVersionOfDependency(dependency) {
	const package_json = await readJSONFile(
		path.resolve(
			__dirname, "..", "node_modules",
			"@anio-jsbundler", dependency, "package.json"
		)
	)

	return package_json.version
}

export default async function() {
	const package_json = await readJSONFile(
		path.resolve(__dirname, "..", "package.json")
	)

	return {
		bundler: {
			version: package_json.version,
			core: await getVersionOfDependency("core")
		},
		runtime: {
			version: await getVersionOfDependency("runtime")
		}
	}
}
