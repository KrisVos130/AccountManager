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

	"getById": (cb, schemaId) => {
		convertSchemaModule.getById(schemaId).then(schema => {
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

	"removeById": (cb, schemaId) => {
		convertSchemaModule.removeById(schemaId).then(() => {
			cb({
				status: "success"
			});
		}).catch(err => {
			cb({
				status: "failure"
			});
		});
	},

	"getAll": (cb) => {
		convertSchemaModule.getAll().then(schemas => {
			cb({
				status: "success",
				schemas
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
