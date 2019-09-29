'use strict';

// This file contains all the logic for Socket.IO

const coreClass = require("../core");

const async = require("async");
const config = require("config");

const express = require("express");
const http = require("http");
const socketio = require('socket.io');

module.exports = class extends coreClass {
	/*constructor(name, moduleManager) {
		super(name, moduleManager);

		//this.dependsOn = ["app", "db", "cache", "utils"];
	}*/

	initialize() {
		return new Promise(resolve => {
			this.setStage(1);
			
			const app = express();
			const server = http.createServer(app);
			const io = socketio(server);

			this.handlers = {
				"getAccounts": cb => {
					cb({
						accounts: []
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
