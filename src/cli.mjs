#!/usr/bin/env node
import {colorize} from "@anio-jsbundler/utilities"
import print from "./lib/print.mjs"
import fs from "node:fs/promises"
import path from "node:path"
import runPhases from "./phase/index.mjs"

const args = process.argv.slice(2)
const flags = args.length > 1 ? args.slice(1) : []
const valid_flags = [
	"-no-scrub", "-no-remove", "-no-autogen", "-no-build", "-collapsed"
]
let flags_obj = {}

if (!args.length) {
	print(
		`Usage: anio-jsbundler <project-root> [...flags]

    Possible flags and their meaning:

        -no-scrub
             Disable scrubbing of auto-generated files

        -no-remove
             Disable removal of obsolete auto-generated files

        -no-autogen
             Disable auto-generation of files

        -no-build
             Disable building of output files
\n`
	)
	process.exit(2)
}

for (const flag of valid_flags) {
	if (flag.startsWith("-no-")) {
		flags_obj[flag.slice(4)] = true
	} else {
		flags_obj[flag.slice(1)] = false
	}
}

for (const flag of flags) {
	if (!valid_flags.includes(flag)) {
		print(`invalid flag '${flag}'\n`)
		process.exit(2)
	}

	if (flag.startsWith("-no-")) {
		flags_obj[flag.slice(4)] = false
	} else {
		flags_obj[flag.slice(1)] = true
	}
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
	project.start = performance.now()
	project.flags = flags_obj

	await runPhases(project)
} catch (error) {
	print(colorize("red.bold", `⛔ A fatal error occurred: ${error.message}\n\n`))
	print(colorize("gray", error.stack) + "\n")

	process.exit(1)
}
