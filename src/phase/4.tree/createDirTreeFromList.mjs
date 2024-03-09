import print from "../../lib/print.mjs"

import path from "node:path"
import fs from "node:fs"

import {colorize} from "@anio-gyp/utilities"
import nodeFsUtils from "@anio-node-foundation/fs-utils"

export default function(project, list) {
	let dirs = {}

	for (const file of list) {
		dirs[path.dirname(file)] = 1
	}

	for (const dir of Object.keys(dirs)) {
		const absolute_dir_path = path.join(
			project.root, dir
		)

		print(`    Create ${colorize("gray", dir)}\n`)

		if (!nodeFsUtils.isRegularDirectory.sync(absolute_dir_path)) {
			fs.mkdirSync(absolute_dir_path, {
				recursive: true
			})
		}
	}
}
