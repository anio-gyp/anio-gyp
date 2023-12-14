import lib from "./type/lib/index.mjs"

export default async function(project) {
	if (project.config.type === "lib") {
		await lib(project)
	}
}
