import path from "node:path"
import {
	isRegularFileSync
} from "@anio-gyp/utilities/fs"

export default async function(project_root) {
	const joytest_path = path.join(
		project_root, "node_modules", "joytest", "package.json"
	)

	if (!isRegularFileSync(joytest_path)) {
		throw new Error(
			`In order to use tests you need to install "joytest" in the project.`
		)
	}

	const mod = await import(
		path.join(project_root, "node_modules", "joytest", "dist", "package.mjs")
	)

	return mod
}
