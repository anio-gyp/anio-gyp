#!/usr/bin/env node
import print from "./lib/print.mjs"
import fs from "node:fs/promises"
import main from "./main.mjs"
import path from "node:path"
import generateProjectContext from "./lib/generateProjectContext/index.mjs"

const args = process.argv.slice(2)

if (args.length !== 1) {
	print(
		`Usage: anio_jsbundler <project-root> [--no-auto-files]\n`
	)
	process.exit(2)
}

let project = {
	root: null,
	config: null
}

try {
	project.root = await fs.realpath(args[0])
} catch (error) {
	print(
		`${args[0]}: no such file or directory.\n`
	)
	process.exit(2)
}

try {
	const config = (await import(
		path.resolve(project.root, "anio_project.mjs")
	)).default

	if (typeof config === "function") {
		project.config = await config()
	} else {
		project.config = config
	}
} catch (error) {
	print(
		`Could not read anio_project.mjs: ${error.message}\n`
	)
	process.exit(2)
}

// pkg json
try {
	const package_json = JSON.parse((await fs.readFile(
		path.resolve(project.root, "package.json")
	)).toString())

	project.package_json = package_json
} catch (error) {
	print(
		`Could not read package.json: ${error.message}\n`
	)
	process.exit(2)
}

try {
	project.warnings = []
	project.files_to_autogenerate = []
	project.files_to_remove = []
	// null means directory "bundle.resources" does not exist
	project.bundled_resources = null

	// what's inside the context variable
	// is dependent on the project type
	project.context = await generateProjectContext(project)

	await main({

	}, project)
} catch (error) {
	print(`${error.message}\n`)
	process.exit(1)
}
