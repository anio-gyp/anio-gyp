import path from "node:path"
import {fileURLToPath} from "node:url"
import fs from "node:fs/promises"

const __dirname = path.dirname(
	fileURLToPath(import.meta.url)
)

export default async function(project, file_path) {
	if (project.config.type === "lib") {
		const file = path.basename(file_path)

		return (await fs.readFile(
			path.join(__dirname, "_support_files", "lib", file)
		)).toString()
	}

	throw new Error(`Unknown supoort file '${file_path}'`)
}
