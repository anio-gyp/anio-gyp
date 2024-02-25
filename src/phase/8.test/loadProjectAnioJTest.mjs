import path from "node:path"
import {
	isRegularFileSync
} from "@anio-gyp/utilities/fs"

export default async function(project_root) {
	const anio_jtest_path = path.join(
		project_root, "node_modules", "anio-jtest", "package.json"
	)

	if (!isRegularFileSync(anio_jtest_path)) {
		throw new Error(
			`In order to use tests you need to install "anio-jtest" in the project.`
		)
	}

	const mod = await import(
		path.join(project_root, "node_modules", "anio-jtest", "dist", "package.mjs")
	)

	return mod
}
