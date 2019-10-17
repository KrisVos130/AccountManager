const moduleManager = require("../../../index");

const utilModule = moduleManager.modules["util"];

module.exports = {
	"getAutosuggest": async cb => {
		cb({
			autosuggest: await utilModule.autosuggestCache
		});
	}
}