const moduleManager = require("../../../index");

const mongoModule = moduleManager.modules["mongo"];
const accountSchemaModule = moduleManager.modules["accountSchema"];

module.exports = {
	"getLatest": cb => {
		accountSchemaModule.getLatest().then(schema => {
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

	"getByVersion": (cb, version) => {
		accountSchemaModule.getByVersion(version).then(schema => {
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

	"getAllVersions": (cb) => {
		accountSchemaModule.getAllVersions().then(versions => {
			cb({
				status: "success",
				versions
			});
		}).catch(err => {
			cb({
				status: "failure"
			});
		});
	},

	"getAll": cb => {
		accountSchemaModule.getAll().then(schemas => {
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

	"getById": (cb, schemaId) => {
		accountSchemaModule.getById(schemaId).then(schema => {
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
		accountSchemaModule.import(name).then(() => {
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
