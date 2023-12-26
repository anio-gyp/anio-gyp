import lib from "./type/lib/index.mjs"

import {
	cleanAutoDirectory
} from "@anio-jsbundler/core"

export default async function(project) {
	await cleanAutoDirectory(project)

	if (project.config.type === "lib") {
		await lib(project)
	}
}
