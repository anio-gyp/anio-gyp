import getBundlerPackageJSON from "./../../lib/getBundlerPackageJSON.mjs"

export default async function(project, file_path) {
	const package_json = await getBundlerPackageJSON()
	const [major, minor, bug] = package_json.version.split(".").map(x => parseInt(x, 10))

	return `${project.options["update-root-url"]}/v${major}/${file_path}?rnd=${Math.random()}`
}
