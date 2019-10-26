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

			this._autosuggestCache = {};
			this._autosuggestMap = {};

			this.accountSchemaModel = await this.mongoModule.model("accountSchema");
			this.accountModel = await this.mongoModule.model("account");

			async.waterfall([
				(next) => {
					this.accountSchemaModel.find({}, null, { sort: "-version" }, next);
				},

				(schemas, next) => {
					schemas.forEach(schema => {
						this._autosuggestMap[schema.version] = {};
						schema.fields.forEach(field => {
							field.fieldTypes.forEach(fieldType => {
								if (fieldType.type === "text" && fieldType.autosuggestGroup) {
									this._autosuggestMap[schema.version][`${field.fieldId}.${fieldType.fieldTypeId}`] = fieldType.autosuggestGroup;
									this._autosuggestCache[fieldType.autosuggestGroup] = [];
								}
							});
						});
					});

					this.accountModel.find({}, next);
				},

				(accounts, next) => {
					accounts.forEach(account => {
						Object.keys(this._autosuggestMap[account.version]).forEach(key => {
							let autosuggestGroup = this._autosuggestMap[account.version][key];
							let fieldId = key.split(".")[0];
							let fieldTypeId = key.split(".")[1];
							account.fields[fieldId].forEach(field => {
								if (this._autosuggestCache[autosuggestGroup].indexOf(field[fieldTypeId]) === -1)
									this._autosuggestCache[autosuggestGroup].push(field[fieldTypeId]);
							});
						});
					});

					next();
				}
			], (err) => {
				if (err) reject(new Error(err));
				else resolve();
			});

			resolve();
		})
	}

	get autosuggestCache() {
		return new Promise(async resolve => {
			try { await this._validateHook(); } catch { return; }
			resolve(this._autosuggestCache);
		});
	}

	get autosuggestMap() {
		return new Promise(async resolve => {
			try { await this._validateHook(); } catch { return; }
			resolve(this._autosuggestMap);
		});
	}

	async addAutosuggestAccount(account) {
		try { await this._validateHook(); } catch { return; }
		Object.keys(this._autosuggestMap[account.version]).forEach(key => {
			let autosuggestGroup = this._autosuggestMap[account.version][key];
			let fieldId = key.split(".")[0];
			let fieldTypeId = key.split(".")[1];
			account.fields[fieldId].forEach(field => {
				if (this._autosuggestCache[autosuggestGroup].indexOf(field[fieldTypeId]) === -1)
					this._autosuggestCache[autosuggestGroup].push(field[fieldTypeId]);
			});
		});
	}
}
