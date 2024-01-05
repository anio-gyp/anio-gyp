import fs from "node:fs/promises"
import {fileURLToPath} from "node:url"
import path from "node:path"

const __dirname = path.dirname(
	fileURLToPath(import.meta.url)
)

export default async function(project) {
	const package_json = (
		await fs.readFile(
			path.join(__dirname, "..", "..", "package.json")
		)
	).toString()

	return JSON.parse(package_json)
}
