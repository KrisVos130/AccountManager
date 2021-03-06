'use strict';

const async = require("async");
const fs = require("fs");
const path = require("path");

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

			this.accountSchemaSchema = await this.mongoModule.schema("accountSchema");
			this.accountSchemaModel = await this.mongoModule.model("accountSchema");

			this.schemaDirectoryPath = path.join(__dirname, "..", "schemas", "account");

			resolve();
		})
	}

	async getLatest() {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			this.accountSchemaModel.find({}, null, { sort: "-version", limit: 1 }, (err, schemas) => {
				if (err || !schemas || schemas.length !== 1) reject(new Error("Something went wrong."))
				else resolve(schemas[0]);
			});
		});
	}

	async getAllVersions() {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			this.accountSchemaModel.find({}, null, { sort: "-version" }, (err, schemas) => {
				if (err || !schemas) reject(new Error("Something went wrong."))
				else resolve(schemas.map(schema => schema.version));
			});
		});
	}

	async getAll() {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			this.accountSchemaModel.find({}, null, { sort: "-version" }, (err, schemas) => {
				if (err || !schemas) reject(new Error("Something went wrong."))
				else resolve(schemas)
			});
		});
	}

	async getById(schemaId) {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			this.accountSchemaModel.findById(schemaId, (err, schema) => {
				if (err || !schema) reject(new Error("Something went wrong."))
				else resolve(schema)
			});
		});
	}

	async removeById(schemaId) {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			this.accountSchemaModel.deleteOne({ _id: schemaId }, (err, res) => {
				if (err) reject(new Error("Something went wrong."));
				else if (res.deletedCount !== 1) reject(new Error("Nothing was removed."));
				else resolve();
			});
		});
	}

	async getByVersion(version) {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			this.accountSchemaModel.findOne({ version }, (err, schema) => {
				if (err || !schema) reject(new Error("Something went wrong."))
				else resolve(schema)
			});
		});
	}

	async listSchemasInDirectory() {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			fs.readdir(this.schemaDirectoryPath, (err, files) => {
				if (err) reject(new Error(err.message))
				else resolve(files.map(file => file.substring(0, file.length - 3)));
			});
				
		});
	}

	async import(name) {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			let schema = require(`../schemas/account/${name}`);
			this.accountSchemaModel.create(schema, (err) => {
				if (err) reject(new Error(err.message))
				else resolve();
			});
		});
	}
}
