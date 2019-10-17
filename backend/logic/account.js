'use strict';

const async = require("async");

const coreClass = require("../core");

const config = require('config');

module.exports = class extends coreClass {
	constructor(name, moduleManager) {
		super(name, moduleManager);

		this.dependsOn = ["mongo"];
	}

	initialize() {
		return new Promise(async (resolve, reject) => {
			this.setStage(1);

			this.mongoModule = this.moduleManager.modules["mongo"];
			this.utilModule = this.moduleManager.modules["util"];

			this.accountSchema = await this.mongoModule.schema("account");
			this.accountModel = await this.mongoModule.model("account");

			resolve();
		})
	}

	async getAll() {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			this.accountModel.find({}, (err, accounts) => {
				if (err) reject(new Error(err));
				else resolve(accounts);
			});
		});
	}

	async getById(accountId) {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			this.accountModel.findById(accountId, (err, account) => {
				if (err) reject(new Error(err));
				else resolve(account);
			});
		});
	}

	async add(account) {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }
			
			this.accountModel.create(account, (err) => {
				if (err) reject(new Error(err));
				else {
					this.utilModule.addAutosuggestAccount(account);
					resolve();
				}
			});
		});
	}

	async editById(accountId, account) {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			this.accountModel.updateOne({ _id: accountId }, account, (err) => {
				if (err) reject(new Error(err));
				else {
					this.utilModule.addAutosuggestAccount(account);
					resolve();
				}
			});
		});
	}
}
