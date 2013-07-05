var plugins = {
	attach: function(plugin, options) {
		this.log.debug('Attaching plugin %s', plugin.name);
		this.plugins.push(plugin);
		plugin.attach.call(this, options||{});
	},
	handle: function(callback) {
		var index = 0, self = this;

		function next() {
			var plugin = self.plugins[index++];

			if(!plugin && callback)
				callback.call(self);
			else {
				self.log.debug('Initialize plugin %s', plugin.name);
				plugin.init.call(self, next);
			}
		}
		next();
	}
}

exports.attach = plugins.attach
exports.handle = plugins.handle