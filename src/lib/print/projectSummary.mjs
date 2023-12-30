import print from "../print.mjs"

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

	print(
		colorize("white.bold", "🏡 Project Summary") + "\n\n"
	)

	print(
		colorize("gray", "    Type                    : ") + project_type_str + "\n"
	)

	print(
		colorize("gray", "    Has bundled resources ? : ") + has_bundled_resources + "\n"
	)

	print(
		colorize("gray", "    Bundle id               : ") + project_bundle_id_str + "\n"
	)

	print(
		colorize("gray", "    Number of exports       : ") + "n/a\n"
	)

	print(
		colorize("gray", "    Bundler version         : ") + "v" + project.bundler_meta.bundler.version + "\n"
	)

	print(
		colorize("gray", "    Utilities version       : ") + "v" + project.bundler_meta.bundler.utilities + "\n"
	)

	print(
		colorize("gray", "    Runtime version         : ") + "v" + project.bundler_meta.runtime.version + "\n"
	)

	print("\n")
}
