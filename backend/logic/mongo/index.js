'use strict';

const coreClass = require("../../core");

const mongoose = require('mongoose');
const config = require('config');

/*const bluebird = require('bluebird');

mongoose.Promise = bluebird;*/

module.exports = class extends coreClass {
	initialize() {
		return new Promise((resolve, reject) => {
			this.setStage(1);

			this._schemas = {};
			this._models = {};

			const mongoUrl = config.get("mongo").url;

			mongoose.connect(mongoUrl, {
				useNewUrlParser: true,
				useCreateIndex: true,
				reconnectInterval: 3000,
				reconnectTries: 10
			})
				.then(() => {
					this._schemas = {
						convertSchema: new mongoose.Schema(require(`./schemas/convertSchema`)),
						accountSchema: new mongoose.Schema(require(`./schemas/accountSchema`)),
						account: new mongoose.Schema(require(`./schemas/account`))
					};
		
					this._models = {
						convertSchema: mongoose.model('convertSchema', this._schemas.convertSchema),
						accountSchema: mongoose.model('accountSchema', this._schemas.accountSchema),
						account: mongoose.model('account', this._schemas.account)
					};

					mongoose.connection.on('error', err => {
						this.logger.error("DB_MODULE", err);
					});

					mongoose.connection.on('disconnected', () => {
						this.logger.error("DB_MODULE", "Disconnected, going to try to reconnect...");
						this.setState("RECONNECTING");
					});

					mongoose.connection.on('reconnected', () => {
						this.logger.success("DB_MODULE", "Reconnected.");
						this.setState("INITIALIZED");
					});

					mongoose.connection.on('reconnectFailed', () => {
						this.logger.error("DB_MODULE", "Reconnect failed, stopping reconnecting.");
						this.failed = true;
						this._lockdown();
					});
		
					/*// User
					this.schemas.user.path('username').validate((username) => {
						return (isLength(username, 2, 32) && regex.custom("a-zA-Z0-9_-").test(username));
					}, 'Invalid username.');
		
					this.schemas.user.path('email.address').validate((email) => {
						if (!isLength(email, 3, 254)) return false;
						if (email.indexOf('@') !== email.lastIndexOf('@')) return false;
						return regex.emailSimple.test(email) && regex.ascii.test(email);
					}, 'Invalid email.');

					// Station
					this.schemas.station.path('name').validate((id) => {
						return (isLength(id, 2, 16) && regex.az09_.test(id));
					}, 'Invalid station name.');
		
					this.schemas.station.path('displayName').validate((displayName) => {
						return (isLength(displayName, 2, 32) && regex.ascii.test(displayName));
					}, 'Invalid display name.');
		
					this.schemas.station.path('description').validate((description) => {
						if (!isLength(description, 2, 200)) return false;
						let characters = description.split("");
						return characters.filter((character) => {
							return character.charCodeAt(0) === 21328;
						}).length === 0;
					}, 'Invalid display name.');
		
					this.schemas.station.path('owner').validate({
						validator: (owner) => {
							return new Promise((resolve, reject) => {
								this.models.station.countDocuments({ owner: owner }, (err, c) => {
									if (err) reject(new Error("A mongo error happened."));
									else if (c >= 3) reject(new Error("User already has 3 stations."));
									else resolve();
								});
							});
						},
						message: 'User already has 3 stations.'
					});
		
					/*
					this.schemas.station.path('queue').validate((queue, callback) => { //Callback no longer works, see station max count
						let totalDuration = 0;
						queue.forEach((song) => {
							totalDuration += song.duration;
						});
						return callback(totalDuration <= 3600 * 3);
					}, 'The max length of the queue is 3 hours.');
		
					this.schemas.station.path('queue').validate((queue, callback) => { //Callback no longer works, see station max count
						if (queue.length === 0) return callback(true);
						let totalDuration = 0;
						const userId = queue[queue.length - 1].requestedBy;
						queue.forEach((song) => {
							if (userId === song.requestedBy) {
								totalDuration += song.duration;
							}
						});
						return callback(totalDuration <= 900);
					}, 'The max length of songs per user is 15 minutes.');
		
					this.schemas.station.path('queue').validate((queue, callback) => { //Callback no longer works, see station max count
						if (queue.length === 0) return callback(true);
						let totalSongs = 0;
						const userId = queue[queue.length - 1].requestedBy;
						queue.forEach((song) => {
							if (userId === song.requestedBy) {
								totalSongs++;
							}
						});
						if (totalSongs <= 2) return callback(true);
						if (totalSongs > 3) return callback(false);
						if (queue[queue.length - 2].requestedBy !== userId || queue[queue.length - 3] !== userId) return callback(true);
						return callback(false);
					}, 'The max amount of songs per user is 3, and only 2 in a row is allowed.');
					*/


					// Song
					/*let songTitle = (title) => {
						return isLength(title, 1, 100);
					};
					this.schemas.song.path('title').validate(songTitle, 'Invalid title.');
					this.schemas.queueSong.path('title').validate(songTitle, 'Invalid title.');
		
					this.schemas.song.path('artists').validate((artists) => {
						return !(artists.length < 1 || artists.length > 10);
					}, 'Invalid artists.');
					this.schemas.queueSong.path('artists').validate((artists) => {
						return !(artists.length < 0 || artists.length > 10);
					}, 'Invalid artists.');
		
					let songArtists = (artists) => {
						return artists.filter((artist) => {
								return (isLength(artist, 1, 64) && artist !== "NONE");
							}).length === artists.length;
					};
					this.schemas.song.path('artists').validate(songArtists, 'Invalid artists.');
					this.schemas.queueSong.path('artists').validate(songArtists, 'Invalid artists.');
		
					let songGenres = (genres) => {
						if (genres.length < 1 || genres.length > 16) return false;
						return genres.filter((genre) => {
								return (isLength(genre, 1, 32) && regex.ascii.test(genre));
							}).length === genres.length;
					};
					this.schemas.song.path('genres').validate(songGenres, 'Invalid genres.');
					this.schemas.queueSong.path('genres').validate(songGenres, 'Invalid genres.');
		
					let songThumbnail = (thumbnail) => {
						if (!isLength(thumbnail, 1, 256)) return false;
						if (config.get("cookie.secure") === true) return thumbnail.startsWith("https://");
						else return thumbnail.startsWith("http://") || thumbnail.startsWith("https://");
					};
					this.schemas.song.path('thumbnail').validate(songThumbnail, 'Invalid thumbnail.');
					this.schemas.queueSong.path('thumbnail').validate(songThumbnail, 'Invalid thumbnail.');

					// Playlist
					this.schemas.playlist.path('displayName').validate((displayName) => {
						return (isLength(displayName, 1, 32) && regex.ascii.test(displayName));
					}, 'Invalid display name.');
		
					this.schemas.playlist.path('createdBy').validate((createdBy) => {
						this.models.playlist.countDocuments({ createdBy: createdBy }, (err, c) => {
							return !(err || c >= 10);
						});
					}, 'Max 10 playlists per user.');
		
					this.schemas.playlist.path('songs').validate((songs) => {
						return songs.length <= 5000;
					}, 'Max 5000 songs per playlist.');
		
					this.schemas.playlist.path('songs').validate((songs) => {
						if (songs.length === 0) return true;
						return songs[0].duration <= 10800;
					}, 'Max 3 hours per song.');
		
					// Report
					this.schemas.report.path('description').validate((description) => {
						return (!description || (isLength(description, 0, 400) && regex.ascii.test(description)));
					}, 'Invalid description.');*/

					resolve();
				})
				.catch(err => {
					this.logger.error("DB_MODULE", err);
					reject(err);
				});
		})
	}

	async schema(name) {
		return new Promise(async resolve => {
			try { await this._validateHook(); } catch { return; }
			resolve(this._schemas[name]);
		});
	}

	async model(name) {
		return new Promise(async resolve => {
			try { await this._validateHook(); } catch { return; }
			resolve(this._models[name]);
		});
	}
}
