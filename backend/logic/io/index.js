'use strict';

// This file contains all the logic for Socket.IO

const coreClass = require("../../core");

const async = require("async");
const config = require("config");

const express = require("express");
const http = require("http");
const socketio = require('socket.io');

let temporaryAutosuggestCache = {};
let temporaryAutosuggestMap = {};

module.exports = class extends coreClass {
	constructor(name, moduleManager) {
		super(name, moduleManager);

		this.dependsOn = ["mongo"];
	}

	initialize() {
		return new Promise(resolve => {
			this.setStage(1);
			
			const app = express();
			const server = http.createServer(app);
			const io = socketio(server);

			this.mongo = this.moduleManager.modules["mongo"];

			this.mongo.models.accountSchema.find({}, null, { sort: "-version", limit: 1 }, (err, res) => {
				if (!err) {
					res[0].fields.forEach(field => {
						field.fieldTypes.forEach(fieldType => {
							if (fieldType.type === "text" && fieldType.autosuggestGroup) {
								temporaryAutosuggestMap[`${field.fieldId}.${fieldType.fieldTypeId}`] = fieldType.autosuggestGroup;
								temporaryAutosuggestCache[fieldType.autosuggestGroup] = [];
							}
						});
					});

					this.mongo.models.account.find({}, (err, accounts) => {
						if (!err) {
							accounts.forEach(account => {
								Object.keys(temporaryAutosuggestMap).forEach(key => {
									let autosuggestGroup = temporaryAutosuggestMap[key];
									let fieldId = key.split(".")[0];
									let fieldTypeId = key.split(".")[1];
									account.fields[fieldId].forEach(field => {
										if (temporaryAutosuggestCache[autosuggestGroup].indexOf(field[fieldTypeId]) === -1)
											temporaryAutosuggestCache[autosuggestGroup].push(field[fieldTypeId]);
									});
								});
							});

							console.log(temporaryAutosuggestCache);
							console.log(temporaryAutosuggestMap);
						}
					});
				}
			});

			

			this.handlers = {
				"getAutosuggest": cb => {
					cb({
						autosuggest: temporaryAutosuggestCache
					});
				},

				"getAccounts": cb => {
					this.mongo.models.account.find({}, (err, accounts) => {
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
				},

				"getAccount": (cb, accountId) => {
					this.mongo.models.account.findById(accountId, (err, account) => {
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
				},

				"addAccount": (cb, account) => {
					this.mongo.models.account.create(account, (err) => {
						if (err)
							return cb({
								status: "failure",
								err: err
							});
						else {
							Object.keys(temporaryAutosuggestMap).forEach(key => {
								let autosuggestGroup = temporaryAutosuggestMap[key];
								let fieldId = key.split(".")[0];
								let fieldTypeId = key.split(".")[1];
								account.fields[fieldId].forEach(field => {
									if (temporaryAutosuggestCache[autosuggestGroup].indexOf(field[fieldTypeId]) === -1)
										temporaryAutosuggestCache[autosuggestGroup].push(field[fieldTypeId]);
								});
							});
							console.log("Added account!");
							return cb({
								status: "success"
							});
						}
					});
				},

				"editAccount": (cb, accountId, account) => {
					this.mongo.models.account.updateOne({ _id: accountId }, account, (err) => {
						if (err)
							return cb({
								status: "failure",
								err: err
							});
						else {
							Object.keys(temporaryAutosuggestMap).forEach(key => {
								let autosuggestGroup = temporaryAutosuggestMap[key];
								let fieldId = key.split(".")[0];
								let fieldTypeId = key.split(".")[1];
								account.fields[fieldId].forEach(field => {
									if (temporaryAutosuggestCache[autosuggestGroup].indexOf(field[fieldTypeId]) === -1)
										temporaryAutosuggestCache[autosuggestGroup].push(field[fieldTypeId]);
								});
							});
							console.log("Editted account!");
							return cb({
								status: "success"
							});
						}
					});
				},

				"getAccountSchema": cb => {
					this.mongo.models.accountSchema.find({}, null, { sort: "-version", limit: 1 }, (err, res) => {
						if (err || !res || res.length !== 1)
							return cb({
								status: "failure",
								message: "Something went wrong."
							});
						else
							return cb({
								status: "success",
								schema: res[0]
							});
					});
				},

				"getAccountSchemas": cb => {
					this.mongo.models.accountSchema.find({}, null, { sort: "-version" }, (err, res) => {
						if (err || !res)
							return cb({
								status: "failure",
								message: "Something went wrong."
							});
						else
							return cb({
								status: "success",
								schemas: res
							});
					});
				},

				"getAccountSchemaById": (cb, schemaId) => {
					this.mongo.models.accountSchema.findById(schemaId, (err, res) => {
						if (err || !res)
							return cb({
								status: "failure",
								message: "Something went wrong."
							});
						else
							return cb({
								status: "success",
								schema: res
							});
					});
				},

				"importAccountSchema": (cb, name) => {
					let schema = require(`../schemas/${name}`);
					this.mongo.models.accountSchema.create(schema, (err) => {
						if (err)
							return cb({
								status: "failure",
								err: err
							});
						else
							return cb({
								status: "success"
							});
					});
				}
			}

			io.on('connection', (socket) => {
				console.log('a user connected');

				Object.keys(this.handlers).forEach(handlerName => {
					socket.on(handlerName, (...args) => {
						let cb = args[args.length - 1];
						if (typeof cb !== "function")
							cb = () => {
								this.logger.info("IO_MODULE", `There was no callback provided for ${name}.`);
							}
						else args.pop();

						this.handlers[handlerName].apply(null, [cb].concat(args));
					});
				});
			});

			server.listen(8080, function(){
				console.log('listening on *:8080');

				resolve();
			});
		});
	}
}
