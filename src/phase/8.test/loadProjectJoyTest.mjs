import path from "node:path"
import nodeFsUtils from "@anio-node-foundation/fs-utils"

export default async function(project_root) {
	const joytest_path = path.join(
		project_root, "node_modules", "joytest", "package.json"
	)

	if (!nodeFsUtils.isRegularFile.sync(joytest_path)) {
		throw new Error(
			`In order to use tests you need to install "joytest" in the project.`
		)
	}

	const mod = await import(
		path.join(project_root, "node_modules", "joytest", "dist", "package.mjs")
	)

	return mod
}
