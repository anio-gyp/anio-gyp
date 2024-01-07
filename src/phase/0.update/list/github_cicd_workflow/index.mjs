import checkGitHubCICDWorkflow from "./checkGitHubCICDWorkflow.mjs"

export default {
	label: "GitHub CI/CD Workflow",

	async run(project) {
		await checkGitHubCICDWorkflow(project)
	}
}
