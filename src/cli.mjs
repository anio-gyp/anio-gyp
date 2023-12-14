#!/usr/bin/env node
import process from "node:process"
import fs from "node:fs/promises"
import main from "./main.mjs"
import path from "node:path"
const args = process.argv.slice(2)

if (args.length !== 1) {
	process.stderr.write(
		`Usage: anio_jsbundler <project-root>\n`
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
	process.stderr.write(
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
	process.stderr.write(
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
	process.stderr.write(
		`Could not read package.json: ${error.message}\n`
	)
	process.exit(2)
}

try {
	await main(project)
} catch (error) {
	process.stderr.write(`${error.message}\n`)
	process.exit(1)
}
