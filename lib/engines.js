var fs = require('fs');

var engines = {
	default: {
		cache: false,
		render: function(template, object, options, done) {
			done(template);
		}
	},
	mustache: {
		require: 'mustache',
		render: function(template, object, options, done) {
			done(this.module.render(template, object));
		}
	},
	hogan: {
		require: 'hogan.js',
		compile: function(data, options, done) {
			done(this.module.compile(data));
		},
		render: function(template, object, options, done) {
			done(template.render(object));
		}
	},
	handlebars: {
		require: 'handlebars',
		compile: function(data, options, done) {
			done(this.module.compile(data));
		},
		render: function(template, object, options, done) {
			done(template(object));
		}
	}
}

module.exports = engines