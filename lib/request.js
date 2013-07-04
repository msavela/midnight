var request = {
	get: function(key) {
		return this.headers[key];
	},
	content: function() {
		return this.headers['Content-Type'];
	}
}

module.exports = request