import {execFileSync} from "child_process"

export default async function(project, deploy_config) {
	let args = ["publish", "--access", "public"]

	const {provenance} = deploy_config

	if (provenance) {
		args.push("--provenance")
	}

	execFileSync(
		"npm", args, {
			stdio: "pipe",
			cwd: project.root
		}
	)
}
