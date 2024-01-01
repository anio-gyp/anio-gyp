import print from "../lib/print.mjs"

import {colorize} from "@anio-jsbundler/utilities"

function printWarning(warning) {
	print(`    ⚠️  ${warning}.\n`)
}

export default function(warnings) {
	if (!warnings.length) {
		return
	}

	const h = (str) => {
		return colorize("yellow.bold", str)
	}

	print(colorize("white.bold", "⚠️  Warnings") + "\n\n")

	for (const {id, data} of warnings) {
		switch (id) {
			case "lib.unsupported.file": {
				printWarning(`Unsupported file in source folder ${h(data.relative_path)} - this file will be ignored`)
			} break

			case "lib.duplicate_export": {
				printWarning(`Both ${h(data.canonical_name)} and ${h(data.canonical_name + "Factory")} specified - this is supported but not recommended`)
			} break

			case "lib.reserved_name": {
				printWarning(`Used reserved name ${h(data.entry.canonical_name)} - these exports will be ignored`)
			} break

			default: {
				throw new Error(`Got an unknown warning with id '${id}'`)
			}
		}
	}

	print("\n")
}
