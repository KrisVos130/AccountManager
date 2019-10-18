module.exports = {
	name: { type: String, required: true },
	description: { type: String, required: true },
	version: { type: Number, required: true, unique: true },
	fields: [{ type: Object }],
	dependencies: { type: Object }
};
