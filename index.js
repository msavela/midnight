var path = require('path'),
	fs = require('fs'),

	request = require('./lib/request.js'),
	response = require('./lib/response.js'),

	log = require('./lib/log.js'),

	pkg = require('./package.json');

var application = function() {
	var app = {
		stack: [],
		routes: [],
		plugins: [],
		cache: {},
		config: {},
		globals: {
			title: 'Midnight ' + pkg.version
		},

		// Configuration
		configure: require('./lib/config.js'),

		// Start the server
		start: require('./lib/server.js'),

		// Route
		route: require('./lib/route.js'),

		// Templates
		render: require('./lib/template.js').render,
		engine: require('./lib/template.js').engine,
		engines: require('./lib/engines.js'),

		// Utils
		utils: require('./lib/utils.js'),

		// Middleware
		use: require('./lib/middleware.js').use,

		// Plugins
		attach: require('./lib/plugin.js').attach,

		log: {
			trace: 	function() { log.trace.apply(app, arguments) },
			debug: 	function() { log.debug.apply(app, arguments) },
			info: 	function() { log.info.apply(app, arguments) },
			warn: 	function() { log.warn.apply(app, arguments) },
			error: 	function() { log.error.apply(app, arguments) },
			fatal: 	function() { log.fatal.apply(app, arguments) },
			level: 	log.level
		}
	};

	// Middleware to extend request and response objects
	app.use(function(req, res, next) {
		// Extend request
		request.app = app
		app.utils.merge(req, request)
		req.originalUrl = req.url // Add originalUrl

		// Extend response
		response.app = app
		app.utils.merge(res, response)

		next();
	});

	// Default configuration
	app.configure({
		host: '127.0.0.1',
		port: 8080,
		views: '/views',
		root: path.dirname(process.mainModule.filename), // Application root path,
		env: 'development', // Development mode,
		log: app.log.level.info, // Loglevel
		version: pkg.version
	});

	// Use default template engine
	app.engine(app.engines.default);

	return app;
};

module.exports = application