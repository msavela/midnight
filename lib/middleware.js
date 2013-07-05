var middleware = {
	use: function(fn) {
		this.log.debug('Use middleware %s', fn.name || 'unknown');
		this.stack.push(fn);
		return this;
	},

	/**
	 * CREDIT https://github.com/senchalabs/connect/blob/1.x/lib/http.js
	 */
	handle: function(route, req, res, callback) {
		var stack = this.stack.slice(0), index = 0, self = this;

		// Include route specific middleware
		if(route) {
			for(var i=0;i<route.stack.length;i++)
				stack.push(route.stack[i]);
		}

		function next(err) {
			var layer, path, status, c;

			// Next layer
			layer = stack[index++];

			// Stack done
			if(!layer || res.headerSent) {
				// Trigger callback method
				if(callback) return callback(err);
				return;
			}

			try {
				self.log.trace('Process middleware %s', layer.name || 'anonymous');
				var arity = layer.length;
				if(err) {
					if(arity === 4)
						layer(err, req, res, next);
					else
						next(err);
				} else if(arity < 4)
					layer(req, res, next);
				else
					next();
			} catch(e) {
				next(e);
			}
		}
		next();
	}
}

exports.use = middleware.use
exports.handle = middleware.handle