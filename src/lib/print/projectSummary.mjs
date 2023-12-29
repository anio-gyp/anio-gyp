import {colorize} from "@anio-jsbundler/utilities"

export default function(options, project) {
	let has_bundled_resources = "no"
	let project_type_str = "n/a"

	if (project.config.type === "lib") {
		project_type_str = "Library"
	}

	let project_bundle_id_str = project.short_bundle_id

	if (project.bundled_resources !== null) {
		const n = Object.keys(project.bundled_resources).length

		has_bundled_resources = `yes (${n})`
	}

	process.stderr.write(
		colorize("white.bold", "🏡 Project Summary") + "\n\n"
	)

	process.stderr.write(
		colorize("gray", "    Type                    : ") + project_type_str + "\n"
	)

	process.stderr.write(
		colorize("gray", "    Has bundled resources ? : ") + has_bundled_resources + "\n"
	)

	process.stderr.write(
		colorize("gray", "    Bundle id               : ") + project_bundle_id_str + "\n"
	)

	process.stderr.write(
		colorize("gray", "    Number of exports       : ") + "n/a\n"
	)

	process.stderr.write("\n")
}
