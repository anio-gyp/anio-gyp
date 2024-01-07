import checkFileForUpdate from "./checkFileForUpdate.mjs"

export default async function(project) {
	let files_to_check = [
		".github/workflows/cicd.yaml"
	]

	if (project.config.language === "js") {
		files_to_check.push("node_modules/@anio-gyp/project/package.json")
	}

	let updates = []

	for (const file_to_check of files_to_check) {
		const update = await checkFileForUpdate(project, file_to_check)

		if (update !== null) {
			updates.push(update)
		}
	}

	return updates
}
