const moduleManager = require("../../../index");

const mongoModule = moduleManager.modules["mongo"];

module.exports = {
	"getLatest": cb => {
		mongoModule.models.then(models => {
			models.accountSchema.find({}, null, { sort: "-version", limit: 1 }, (err, res) => {
				if (err || !res || res.length !== 1)
					return cb({
						status: "failure",
						message: "Something went wrong."
					});
				else
					return cb({
						status: "success",
						schema: res[0]
					});
			});
		});
	},

	"getAll": cb => {
		mongoModule.models.then(models => {
			models.accountSchema.find({}, null, { sort: "-version" }, (err, res) => {
				if (err || !res)
					return cb({
						status: "failure",
						message: "Something went wrong."
					});
				else
					return cb({
						status: "success",
						schemas: res
					});
			});
		});
	},

	"getById": (cb, schemaId) => {
		mongoModule.models.then(models => {
			models.accountSchema.findById(schemaId, (err, res) => {
				if (err || !res)
					return cb({
						status: "failure",
						message: "Something went wrong."
					});
				else
					return cb({
						status: "success",
						schema: res
					});
			});
		});
	},

	"import": (cb, name) => {
		mongoModule.models.then(models => {
			mongoModule.schemas.then(models => {
				models.accountSchema.create(schemas[name], (err) => {
					if (err)
						return cb({
							status: "failure",
							err: err
						});
					else
						return cb({
							status: "success"
						});
				});
			});
		});
	}
}
