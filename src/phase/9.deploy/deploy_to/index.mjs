import anio_sh from "./anio.sh/index.mjs"
import npmjs_com from "./npmjs.com/index.mjs"

export default {
	"anio.sh": {
		label: "Anio Software Binaries",
		run: anio_sh,
		default_config: {
			deploy_url:["env", "ANIO_SH_DEPLOY_URL"],
			auth_key: ["env", "ANIO_SH_DEPLOY_KEY"],
			file_name: "unnamed",
			release_version: ["env", "RELEASE_VERSION"]
		}
	},

	"npmjs.com": {
		label: "Public NPM Registry",
		run: npmjs_com,
		default_config: {
			provenance: false
		}
	}
}
