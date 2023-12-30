import process from "node:process"

export default function(str) {
	process.stderr.write(str)
}
