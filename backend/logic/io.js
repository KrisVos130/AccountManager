'use strict';

// This file contains all the logic for Socket.IO

const coreClass = require("../core");

const async = require("async");
const config = require("config");

const express = require("express");
const http = require("http");
const socketio = require('socket.io');

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

			this.handlers = {
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
						else
							console.log("Added account!");
							return cb({
								status: "success"
							});
					});
				},

				"editAccount": (cb, accountId, account) => {
					this.mongo.models.account.updateOne({ _id: accountId }, account, (err) => {
						if (err)
							return cb({
								status: "failure",
								err: err
							});
						else
							console.log("Editted account!");
							return cb({
								status: "success"
							});
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
