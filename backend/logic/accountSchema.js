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

			this.accountSchemaSchema = await this.mongoModule.schema("accountSchema");
			this.accountSchemaModel = await this.mongoModule.model("accountSchema");

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

	async getByVersion(version) {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			this.accountSchemaModel.findOne({ version }, (err, schema) => {
				if (err || !schema) reject(new Error("Something went wrong."))
				else resolve(schema)
			});
		});
	}

	async import(name) {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			let schema = require(`../schemas/${name}`);
			this.accountSchemaModel.create(schema, (err) => {
				if (err) reject(new Error(err.message))
				else resolve();
			});
		});
	}
}
