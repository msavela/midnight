var url = require('url');

var Route = function(app, pattern, handler) {
	this.re = app.utils.path.normalize(pattern, this.keys = []);
	this.pattern = pattern;
	this.handler = handler;
	this.methods = [];
	this.stack = [];
	this.app = app;

	this.method = function(method) {
		if(typeof method == 'string')
			this.methods.push(method);
		else if(method instanceof Array) {
			for(var i=0;i<method.length;i++)
				this.methods.push(method[i]);
		}
		return this
	};

	this.get = function() { this.methods.push('GET'); return this };
	this.post = function() { this.methods.push('POST'); return this };
	this.put = function() { this.methods.push('PUT'); return this };
	this.delete = function() { this.methods.push('DELETE'); return this };

	this.use = function(fn) {
		this.app.log.debug('Use middleware %s for route %s', fn.name || 'unknown', this.pattern);
		this.stack.push(fn);
		return this
	};
}

Route.prototype.match = function(path, method) {
	if(this.methods.indexOf(method) != -1) {
		var captures, params = {}, splats = [];

		if(captures = path.match(this.re)) {
			for(var i=1;i<captures.length;++i) {

				var key = this.keys[i-1],
					val = typeof captures[i] === 'string'
						? unescape(captures[i])
						: captures[i];

				if(key) {
					params[key] = val;
				} else {
					splats.push(val);
				}
			}
			return {
				route: this,
				params: params,
				splats: splats
			};
		}
	}
	return;
}

module.exports = function(pattern, handler) {
	var route = new Route(this, pattern, handler);
	this.routes.push(route);
	return route
}