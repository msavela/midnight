var Route = function(pattern, handler) {
	this.re = this.normalize(pattern, this.keys = [])
	this.pattern = pattern
	this.handler = handler;
	this.methods = [];
	this.stack = [];

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

/**
 * CREDIT: https://github.com/visionmedia/express/blob/master/lib/utils.js
 */
Route.prototype.normalize = function(path, keys, sensitive, strict) {
	if (toString.call(path) == '[object RegExp]') return path;
	if (Array.isArray(path)) path = '(' + path.join('|') + ')';
	path = path
		.concat(strict ? '' : '/?')
		.replace(/\/\(/g, '(?:/')
		.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star) {
			keys.push({ name: key, optional: !! optional });
			slash = slash || '';
			return ''
				+ (optional ? '' : slash)
				+ '(?:'
				+ (optional ? slash : '')
				+ (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
				+ (optional || '')
				+ (star ? '(/*)?' : '');
		})
		.replace(/([\/.])/g, '\\$1')
		.replace(/\*/g, '(.*)');
	return new RegExp('^' + path + '$', sensitive ? '' : 'i');
}

module.exports = function(pattern, handler) {
	var route = new Route(pattern, handler);
	route.app = this;
	this.routes.push(route);
	return route
}