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
			this.accountSchemaModule = this.moduleManager.modules["accountSchema"];
			this.convertSchemaModule = this.moduleManager.modules["convertSchema"];

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

			if (!accountId || !account) return reject(new Error("Account ID or Account invalid."));

			this.accountModel.updateOne({ _id: accountId }, account, (err, res) => {
				if (err) reject(new Error(err));
				else {
					this.utilModule.addAutosuggestAccount(account);
					resolve();
				}
			});
		});
	}

	async getMigratedAccount(accountId) {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }
			if (!accountId) return reject(new Error("Account ID invalid."));

			let oldAccount;
			try { oldAccount = await this.getById(accountId); } catch { return reject("Couldn't get account."); }

			let latestVersion;
			try { latestVersion = (await this.accountSchemaModule.getLatest()).version; } catch { return reject("Couldn't get latest schema.");  }

			if (oldAccount.version === latestVersion) return reject(new Error("Account is already up-to-date"));

			let convertSchema;
			try { convertSchema = await this.convertSchemaModule.getForVersion(oldAccount.version); } catch(err) { reject(err); }
			if (!convertSchema.changes) convertSchema.changes = {};

			let oldSchema;
			try { oldSchema = await this.accountSchemaModule.getByVersion(convertSchema.versionFrom); } catch  { return reject("Couldn't get from schema."); }
			let newSchema;
			try { newSchema = await this.accountSchemaModule.getByVersion(convertSchema.versionTo) } catch { return reject("Couldn't get new schema"); }
			
			let defaultNewObjects = {};
			let newAccount = {
				fields: {},
				version: convertSchema.versionTo
			};

			newSchema.fields.forEach(newField => {
				const oldField = oldSchema.fields.find(oldField => oldField.fieldId === newField.fieldId);
				let defaultNewObject = {};
				newField.fieldTypes.forEach(newFieldType => {
					if (newFieldType.type === "text" || newFieldType.type === "select") defaultNewObject[newFieldType.fieldTypeId] = "";
					else if (newFieldType.type === "checkbox") defaultNewObject[newFieldType.fieldTypeId] = false;
				});
				defaultNewObjects[newField.fieldId] = defaultNewObject;

				newAccount.fields[newField.fieldId] = [];

				
				if (oldField) {
					let entries = [];

					oldAccount.fields[oldField.fieldId].forEach(oldAccountFieldEntry => {
						entries.push({});
					});
					 
					newField.fieldTypes.forEach(newFieldType => {
						const oldFieldType = oldField.fieldTypes.find(oldFieldType => oldFieldType.fieldTypeId === newFieldType.fieldTypeId);
						if (oldFieldType) {
							oldAccount.fields[oldField.fieldId].forEach((oldAccountFieldEntry, index) => {
								entries[index][newFieldType.fieldTypeId] = oldAccountFieldEntry[newFieldType.fieldTypeId];
							});
						} else {
							entries = entries.map(entry => {
								entry[newFieldType.fieldTypeId] = defaultNewObject[newFieldType.fieldTypeId];
								return entry;
							});
						}
					});

					newAccount.fields[newField.fieldId] = entries;
				}
			});

			Object.keys(convertSchema.changes).forEach(changeOld => {
				const oldFieldId = changeOld.split("+")[0];
				const oldFieldTypeId = changeOld.split("+")[1];
				const changeNew = convertSchema.changes[changeOld];
				const newFieldId = changeNew.split("+")[0];
				const newFieldTypeId = changeNew.split("+")[1];
				
				const oldField = oldAccount.fields[oldFieldId];
				const newField = newAccount.fields[newFieldId];
				
				const entriesToAdd = oldField.length - newField.length;
				for(let i = 0; i < entriesToAdd; i++) {
					newAccount.fields[newFieldId].push(JSON.parse(JSON.stringify(defaultNewObjects[newFieldId])));
				}

				for(let i = 0; i < newField.length; i++) {
					newAccount.fields[newFieldId][i][newFieldTypeId] = oldAccount.fields[oldFieldId][i][oldFieldTypeId];
				}
			});

			newSchema.fields.forEach(newField => {
				const entriesToAdd = newField.minEntries - newAccount.fields[newField.fieldId];

				for(let i = 0; i < entriesToAdd; i++) {
					newAccount.fields[newField.fieldId].push(JSON.parse(JSON.stringify(defaultNewObjects[newField.fieldId])));
				}
			});

			resolve(newAccount);
		});
	}

	async migrateAccounts(accountIds) {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			let successful = 0;
			let failed = 0;

			async.eachLimit(
				accountIds,
				10,
				(accountId, next) => {
					this.getMigratedAccount(accountId).then(account => {
						if (!account) {
							failed++;
							return next();
						}

						this.editById(accountId, account).then(() => {
							successful++;
							return next();
						}).catch(err => {
							failed++;
							return next();
						});
					}).catch(err => {
						failed++;
						return next();
					});
				},
				(err) => {
					resolve({
						successful,
						failed
					});
				}
			);
		});
	}
}
