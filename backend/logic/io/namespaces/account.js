const moduleManager = require("../../../index");

const accountModule = moduleManager.modules["account"];
const mongoModule = moduleManager.modules["mongo"];
const utilModule = moduleManager.modules["util"];

module.exports = {
	"createEmptyAccount": async (cb, version) => {
		accountModule.createEmptyAccount(version).then(account => {
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

	"migrateAccounts": (cb, accountIds) => {
		accountModule.migrateAccounts(accountIds).then(res => {
			cb({
				status: "success",
				failed: res.failed,
				successful: res.successful
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