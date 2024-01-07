import fs from "node:fs/promises"
import path from "node:path"

export default async function(project, update) {
	await fs.writeFile(
		path.join(project.root, update.path), update.data
	)
}
