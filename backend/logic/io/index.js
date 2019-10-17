'use strict';

// This file contains all the logic for Socket.IO

const coreClass = require("../../core");

const async = require("async");
const config = require("config");

const express = require("express");
const http = require("http");
const socketio = require('socket.io');

module.exports = class extends coreClass {
	constructor(name, moduleManager) {
		super(name, moduleManager);

		this.dependsOn = ["mongo", "util"];
	}

	initialize() {
		return new Promise(async resolve => {
			this.setStage(1);

			const app = express();
			const server = http.createServer(app);
			const io = socketio(server);

			this.mongo = this.moduleManager.modules["mongo"];
			this.util = this.moduleManager.modules["util"];

			this.namespaces = require("./namespaces");

			io.on('connection', (socket) => {
				console.log('a user connected');

				Object.keys(this.namespaces).forEach(namespaceName => {
					Object.keys(this.namespaces[namespaceName]).forEach(handlerName => {
						socket.on(`${namespaceName}.${handlerName}`, (...args) => {
							let cb = args[args.length - 1];
							if (typeof cb !== "function")
								cb = () => {
									this.logger.info("IO_MODULE", `There was no callback provided for ${name}.`);
								}
							else args.pop();

							this.namespaces[namespaceName][handlerName].apply(null, [cb].concat(args));
						});
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
