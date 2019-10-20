const moduleManager = require("../../../index");

const mongoModule = moduleManager.modules["mongo"];
const convertSchemaModule = moduleManager.modules["convertSchema"];

module.exports = {
	"getForVersion": (cb, version) => {
		convertSchemaModule.getForVersion(version).then(schema => {
			cb({
				status: "success",
				schema
			});
		}).catch(err => {
			cb({
				status: "failure"
			});
		});
	},

	"import": (cb, name) => {
		convertSchemaModule.import(name).then(() => {
			cb({
				status: "success"
			});
		}).catch(err => {
			cb({
				status: "failure",
				error: err.message
			});
		});
	}
}
