export default {
	label: "lib:createNoticeFile",

	async run(project) {
		return `This directory is managed by anio-gyp.
Do **NOT** edit these files directly or place any files or folder inside here - they will be deleted.\n`
	}
}
