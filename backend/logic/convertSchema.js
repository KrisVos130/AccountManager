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

			this.convertSchemaSchema = await this.mongoModule.schema("convertSchema");
			this.convertSchemaModel = await this.mongoModule.model("convertSchema");

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

	async import(name) {
		return new Promise(async (resolve, reject) => {
			try { await this._validateHook(); } catch { return; }

			let schema = require(`../schemas/${name}`);
			this.convertSchemaModel.create(schema, (err) => {
				if (err) reject(new Error(err.message))
				else resolve();
			});
		});
	}
}
