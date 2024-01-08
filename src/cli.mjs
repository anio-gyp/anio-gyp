#!/usr/bin/env node
import {colorize} from "@anio-gyp/utilities"
import print from "./lib/print.mjs"
import fs from "node:fs/promises"
import path from "node:path"
import runPhases from "./phase/index.mjs"
import parseCLIArgs from "./lib/parseCLIArgs.mjs"

const args = process.argv.slice(2)

if (!args.length) {
	print(
		`Usage: anio-gyp <project-root> [...options] [...flags]

    Possible options and their meaning:

        --update-root-url https://anio.sh/anio-gyp/
            Root URL to determine which project files need to be updated:

                {ROOT_URL}/v{MAJOR_VERSION}/{FILE_PATH}

            Example using default value:

                https://anio.sh/anio-gyp/v0/.github/workflows/cicd.yaml

                Returns

                {
                    "current": {
                        "version": "current-version",
                        "update": {
                            "strategy": "update-strategy",
                            "data": "update-strategy-data"
                        }
                    },
                    "hashmap": {
                        "<sha256-hash-of-v0.0.1>": "0.0.1",
                        "<sha256-hash-of-v0.0.2>": "0.0.2"
                    }
                }

    Possible flags and their meaning:

        -update
            Enable update of project files before preparation

        -force-update
            Force update of files that have been changed from the original version

        -no-scrub
            Disable scrubbing of auto-generated files

        -no-remove
            Disable removal of obsolete auto-generated files

        -no-autogen
            Disable auto-generation of files

        -no-build
            Disable building of output files

        -tests
            Run unit tests before deployment phase

        -tests-only
            Run only unit tests and skip all other phases

        -deploy
            Enable deployment
\n`
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
	const {flags, options} = parseCLIArgs(args.slice(1))

	project.start = performance.now()
	project.flags = flags
	project.options = options

	await runPhases(project)
} catch (error) {
	print(colorize("red.bold", `⛔ A fatal error occurred: ${error.message}\n\n`))
	print(colorize("gray", error.stack) + "\n")

	process.exit(1)
}
