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

			this.convertSchemaSchema = await this.mongoModule.schema("convertSchema");
			this.convertSchemaModel = await this.mongoModule.model("convertSchema");

			this.schemaDirectoryPath = path.join(__dirname, "..", "schemas", "convert");

			resolve();
		})
	}

	async getForVersion(version) {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			this.convertSchemaModel.findOne({ versionFrom: version }, (err, schema) => {
				if (err) reject(new Error(err.message));
				else if (!schema) reject(new Error("Schema not found."));
				else resolve(schema)
			});
		});
	}

	async getById(schemaId) {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			this.convertSchemaModel.findById(schemaId, (err, schema) => {
				if (err || !schema) reject(new Error("Something went wrong."))
				else resolve(schema)
			});
		});
	}

	async removeById(schemaId) {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			this.convertSchemaModel.deleteOne({ _id: schemaId }, (err, res) => {
				if (err) reject(new Error("Something went wrong."));
				else if (res.deletedCount !== 1) reject(new Error("Nothing was removed."));
				else resolve();
			});
		});
	}

	async getAll() {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			this.convertSchemaModel.find({ }, (err, schemas) => {
				if (err) reject(new Error(err.message));
				else resolve(schemas)
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

			let schema = require(`../schemas/convert/${name}`);
			this.convertSchemaModel.create(schema, (err) => {
				if (err) reject(new Error(err.message))
				else resolve();
			});
		});
	}
}
