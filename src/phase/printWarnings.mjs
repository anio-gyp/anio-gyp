import print from "../lib/print.mjs"

import {colorize} from "@anio-gyp/utilities"

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
			case "update.changed_file": {
				printWarning(`Didn't update changed project file ${h(data)}, run with -force-update to force update it`)
			} break

			case "update.force_updated": {
				printWarning(`Force updated file ${h(data.file)} to ${h("v" + data.to_version)}`)
			} break

			case "update.unable_to_check": {
				printWarning(`Unable to check for updates for file ${h(data.file)}: ${colorize("gray", data.error)}`)
			} break

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
