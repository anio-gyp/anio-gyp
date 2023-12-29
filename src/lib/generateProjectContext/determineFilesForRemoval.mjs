import path from "node:path"
import {isRegularDirectorySync, scandirSync} from "@anio-jsbundler/utilities/fs"

export default async function(project) {
	let ret = []
	const project_auto_dir = path.join(
		project.root, "src", "auto"
	)

	const isContainedInAPath = function(sub_path) {
		for (const [file_path] of project.files_to_autogenerate) {
			if (file_path.includes(sub_path)) {
				return true
			}
		}

		return false
	}

	const isContained = function(file_path) {
		return project.files_to_autogenerate.map(x => x[0]).includes(file_path)
	}

	if (isRegularDirectorySync(project_auto_dir)) {
		const entries = scandirSync.reverse(project_auto_dir)

		for (const {type, relative_path} of entries) {
			// this works because project.files_to_autogenerate
			// will never contain a path to a folder but always a path to a file
			if (
				!isContained(relative_path) &&
				!isContainedInAPath(relative_path + "/")
			) {
				ret.push(relative_path)
			}
		}
	}

	return ret
}
