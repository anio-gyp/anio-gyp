import print from "../../lib/print.mjs"

import {colorize} from "@anio-gyp/utilities"
import loadProjectJoyTest from "./loadProjectJoyTest.mjs"

export default {
	id: "test",
	title: "Testing",
	icon: "🧪",

	async run(project) {
		if (!project.flags["tests"] && !project.flags["tests-only"]) {
			print(`    Skipping because -tests was not specified\n`)

			return
		} else if (!("test" in project.config)) {
			print(
				colorize("gray", "    No tests configured!\n")
			)

			return
		}

		const {
			createJTestSession,
			expandAndValidateInputTestFiles
		} = await loadProjectJoyTest(project.root)

		const test_files = await expandAndValidateInputTestFiles(
			project.root, project.config.test.input
		)

		const jtest_session = createJTestSession({
			project_root: project.root,
			test_files
		})

		jtest_session.on("report", ({id, value}) => {
			if (id !== "test_result") return

			const {test, results} = value

			let all_done = results.filter(r => r === false).length === 0

			if (!all_done) return

			print(`    `)

			const pass = colorize("green", "✔")
			const fail = colorize("red", "✘")
			const error = colorize("yellow", "⚠")
			const timeout = colorize("red", "⏱")

			for (const result of results) {
				if (result.has_error_occurred_during_testing) {
					print(`${error} `)
				} if (result.verdict === "pass") {
					print(`${pass} `)
				} else {
					print(`${fail} `)
				}
			}

			print(`${colorize("gray", test.label)}\n`)
		})

		const result = await jtest_session.run()

		if (!result.successful) {
			print(
				colorize("red.bold", `\n⛔ Stopping here, some unit tests have not passed.\n`)
			)

			process.exit(2)
		}
	}
}
