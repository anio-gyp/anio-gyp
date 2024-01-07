import getBundlerPackageJSON from "./getBundlerPackageJSON.mjs"

export default async function(project) {
	const project_type = project.config.type
	let version_file_path = ""

	switch (project_type) {
		case "lib": {
			version_file_path = "src/auto/VERSION.txt"
		} break
	}

	const pkg = await getBundlerPackageJSON()
	const [major, minor, bug] = pkg.version.split(".")

	let str = ``

	str += `/* Warning: this file was automatically created by anio-gyp v${major}.x.x */\n`

	if (version_file_path.length) {
		str += `/* You will find more information about the specific anio-gyp version used inside the file src/auto/VERSION.txt */\n`
	}

	str += `/* You should commit this file to source control */\n\n`

	return str
}
