export default function(project, library) {
	const reserved = [
		"importWithContext",
		"importWithContextAsync",
		"dict",
		"getUsedDefaultContext"
	]

	return library.filter(entry => {
		const fn = entry.canonical_name

		if (reserved.includes(fn)) {

			project.state.warnings.push({
				id: "lib.reserved_name",
				data: {
					entry
				}
			})

			return false
		}

		return true
	})
}
