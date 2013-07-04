module.exports = function(object) {
	for(var key in object)
		this.config[key] = object[key];
	return this;
}