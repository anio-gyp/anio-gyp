import process from "node:process"

let printing_enabled = true

function print(str) {
	if (!printing_enabled) return

	process.stderr.write(str)
}

print.disable = () => {
	printing_enabled = false
}

print.enable = () => {
	printing_enabled = true
}

export default print
