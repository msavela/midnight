var http = require('http');
var url = require('url');

var plugin = require('./plugin.js').handle;
var middleware = require('./middleware.js').handle;

var server = {
	start: function(config) {
		if(config)
			this.configure(config);

		// Initialize plugins and start the server
		if(Object.keys(this.plugins).length > 0) {
			this.log.debug('Initializing plugins.');
			plugin.call(this, function() {
				this.log.debug('All plugins initialized.');
				server.listen.call(this);
			});
		}
		else
			server.listen.call(this);
		return this;
	},

	listen: function() {
		this.log.info('Starting server at http://' + this.config.host + ":" + this.config.port)

		var self = this;
		this.server = http.createServer(function(request, response) {

			// Find a matching route
			var route, match;
			for(var i=0;i<self.routes.length;i++) {
				match = self.routes[i].re.exec(url.parse(request.url).pathname);
				if(match) {
					if(self.routes[i].methods.indexOf(request.method)) {
						if(self.routes[i].methods.length > 0)
							continue;
					}
					route = self.routes[i];
					break;
				}
			}

			self.log.info('[%s] %s', request.method, url.parse(request.url).pathname)

			middleware.call(self, route, request, response, function(err) {
				if(err) {
					response.status(500);
					if(self.config.env == 'development')
						response.send(err.stack);
					else
						response.send(err.toString());
				} else {
					if(route) {
						if(route.keys.length == 0)
							request.params = match;
						else {
							request.params = {}
							for(var i=0;i<route.keys.length;i++)
								request.params[route.keys[i].name] = match[i+1];
						}

						if(route.handler)
							route.handler(request, response);
					}
					else {
						response.status(404).send('404');
					}
				}
			});
		});
		this.server.listen(this.config.port, this.config.host);
	}
}

module.exports = server.start