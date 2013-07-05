// Plugin extending app.engines to to include custom template engine
module.exports = {
	name: 'my-template-engine',
	attach: function(options) {
		this.engines['custom'] = {
			require: 'hogan.js',
			compile: function(data, options, done) {
				done(this.module.compile(data));
			},
			render: function(template, object, options, done) {
				done(template.render(object));
			}
		};
	},
	init: function(next) {
		// Init is not required for this plugin
		next();
	}
}