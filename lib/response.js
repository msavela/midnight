var response = {
	status: function(status) {
		this.statusCode = status;
		return this;
	},
	set: function(key, value) {
		if(!value) {
			if(typeof key == "string")
				this.removeHeader(key);
			else if(typeof key == "object") {
				for(var header in key)
					this.set(header, key[header]);
			}
		}
		else if(typeof key == "string") {
			this.setHeader(key, value);
		}
		return this;
	},
	content: function(content) {
		if(content)
			this.set('Content-type', content);
		else
			return this.get('Content-Type');
		return this;
	},
	get: function(key) {
		return this.getHeader(key);
	},
	redirect: function(location) {
		this.status(302);
		this.set("Location", location);
		return this;
	},
	encoding: function(encoding) {
		var charset;
		if(this.content().indexOf('charset') !== -1)
			this.content(this.content().split(';')[0] + ';charset=' + encoding);
		else
			this.content(this.content() + ';charset=' + encoding);
		return this
	},
	render: function(template, variables, options) {
		var self = this;
		this.app.render(template, variables, options, function(data) {
			self.send(data);
		});
	},
	send: function(response) {
		if(Buffer.isBuffer(response)) {
			this.content('application/octet-stream');
			this.set('Content-Length', Buffer.byteLength(response));
		} else {
			if(typeof response == 'string')
				this.content('text/html');
			else if(Array.isArray(response) || typeof response == 'object') {
				this.content('application/json');
				response = JSON.stringify(response);
			}
			this.set('Content-Length', response.length);
		}
		this.end(response);
	},
}

module.exports = response