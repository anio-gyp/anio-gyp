import printHousekeeping from "./lib/print/housekeeping.mjs"
import printProjectSummary from "./lib/print/projectSummary.mjs"
import printWarnings from "./lib/print/warnings.mjs"

import removeFiles from "./lib/step/removeFiles.mjs"
import createAutoDirStructure from "./lib/step/createAutoDirStructure.mjs"
import scrubFiles from "./lib/step/scrubFiles.mjs"
import generateAutoFiles from "./lib/step/generateAutoFiles.mjs"
import invokeBundler from "./lib/step/invokeBundler.mjs"

export default async function(options, project) {
	await printProjectSummary(options, project)
	await printWarnings(options, project)
	await printHousekeeping(options, project)

	await removeFiles(options, project)
	await createAutoDirStructure(options, project)
	await scrubFiles(options, project)
	await generateAutoFiles(options, project)
	await invokeBundler(options, project)
}
