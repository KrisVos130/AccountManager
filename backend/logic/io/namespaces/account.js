const moduleManager = require("../../../index");

const accountModule = moduleManager.modules["account"];
const mongoModule = moduleManager.modules["mongo"];
const utilModule = moduleManager.modules["util"];

module.exports = {
	"getAll": async cb => {
		accountModule.getAll().then(accounts => {
			cb({
				status: "success",
				accounts
			});
		}).catch(err => {
			cb({
				status: "failure"
			});
		});
	},

	"getById": (cb, accountId) => {
		accountModule.getById(accountId).then(account => {
			cb({
				status: "success",
				account
			});
		}).catch(err => {
			cb({
				status: "failure"
			});
		});
	},

	"getMigratedAccount": (cb, accountId) => {
		accountModule.getMigratedAccount(accountId).then(account => {
			cb({
				status: "success",
				account
			});
		}).catch(err => {
			cb({
				status: "failure",
				message: err.message
			});
		});
	},

	"add": (cb, account) => {
		accountModule.add(account).then(() => {
			console.log("Added account!");
			cb({
				status: "success"
			});
		}).catch(err => {
			cb({
				status: "failure"
			});
		});
	},

	"editById": (cb, accountId, account) => {
		accountModule.editById(accountId, account).then(() => {
			console.log("Edited account!");
			cb({
				status: "success"
			});
		}).catch(err => {
			cb({
				status: "failure"
			});
		});
	}
}