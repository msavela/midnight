var path = require('path');

var template = {
	render: function(template, object, options, done) {
		if(!object) object = {};
		object.config = this.config;
		object.globals = this.globals;
		if(!options) options = {};

		var self = this;
		var absolutePath = path.join(this.config.root, this.config.views, template);

		// Require module
		if('require' in this.templateHandler && !('module' in this.templateHandler))
			this.templateHandler.module = require(this.templateHandler.require);

		// Use custom file reader if defined
		if('read' in this.templateHandler)
			this.templateHandler.read(absolutePath, compile);
		else
			this.utils.readFile(absolutePath, compile);

		function compile(err, data) {
			if(err) // Render file read error
				done(err);
			else
				finish(data);
		}

		function finish(data) {
			// Use compiled template if available
			if('compile' in self.templateHandler) {
				// Render compiled template from cache
				if(self.templateHandler.cache && self.cache[template])
					self.templateHandler.render(self.cache[template], object, options, done);
				else { // Compile, cache and render
					self.templateHandler.compile(data, options, function(compiled) {
						if((self.templateHandler.cache == undefined || self.templateHandler.cache == true) && self.config.env != 'development')
							self.cache[template] = compiled;
						self.templateHandler.render(compiled, object, options, done);
					});
				}
			} else // Render a string template
				self.templateHandler.render(data, object, options, done);
		}
	},

	engine: function(handler) {
		this.templateHandler = handler;
	}
}

exports.render = template.render
exports.engine = template.engine