const moduleManager = require("../../../index");

const mongoModule = moduleManager.modules["mongo"];
const utilModule = moduleManager.modules["util"];

module.exports = {
	"getAll": async cb => {
		mongoModule.models.then(models => {
			models.account.find({}, (err, accounts) => {
				if (err)
					return cb({
						status: "failure",
						err: err
					});
				else
					return cb({
						status: "success",
						accounts
					});
			});
		});
	},

	"getById": (cb, accountId) => {
		mongoModule.models.then(models => {
			models.account.findById(accountId, (err, account) => {
				if (err || !account)
					return cb({
						status: "failure",
						err: err
					});
				else
					return cb({
						status: "success",
						account
					});
			});
		});
	},

	"add": (cb, account) => {
		mongoModule.models.then(models => {
			models.account.create(account, (err) => {
				if (err)
					return cb({
						status: "failure",
						err: err
					});
				else {
					utilModule.addAutosuggestAccount(account);
					console.log("Added account!");
					return cb({
						status: "success"
					});
				}
			});
		});
	},

	"editById": (cb, accountId, account) => {
		mongoModule.models.then(models => {
			models.account.updateOne({ _id: accountId }, account, (err) => {
				if (err)
					return cb({
						status: "failure",
						err: err
					});
				else {
					utilModule.addAutosuggestAccount(account);
					console.log("Editted account!");
					return cb({
						status: "success"
					});
				}
			});
		});
	}
}