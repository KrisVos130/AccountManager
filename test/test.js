const log = console.log;
console.log = function() {};

var assert = require('assert');

const io = require('socket.io-client');
const backendModuleManager = require("../backend/index.js");

describe('IO module', function() {
	let socket = null;

	describe("Connect", function() {
		it("should connect", function(done) {
			this.timeout(10000);
			socket = io("http://localhost:8080");
			socket.on("connect", () => {
				done();
			});
			socket.on("connect_error", () => {
				done(new Error("Connect error"));
			});
		});
	});

	describe('Handlers', function() {
		describe('getAccounts', function() {
			const expectedAccounts = {
				accounts: []
			};

			it('should return a list of accounts', function(done) {
				socket.emit("getAccounts", res => {
					assert.equal(res.accounts, expectedAccounts);
					done();
				});
			});
		});
	});
});