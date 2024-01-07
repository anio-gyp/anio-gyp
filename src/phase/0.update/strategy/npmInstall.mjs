import {execFileSync} from "child_process"

export default async function(project, update) {
	const result = execFileSync(
		"npm", [
			"install", ...update.data.split(" ")
		], {
			cwd: project.root,
			stdio: "pipe"
		}
	)
}
