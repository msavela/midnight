const path = require("path");
const request = require("./lib/request.js");
const response = require("./lib/response.js");
const pkg = require("./package.json");

const loggerMiddleware = require("./lib/middleware/logger");
const queryMiddleware = require("./lib/middleware/query");

module.exports = () => {
  const app = {
    stack: [],
    routes: [],
    plugins: [],
    cache: {},
    config: {},
    globals: {
      title: "Midnight " + pkg.version
    },
    // Logger
    log: require("./lib/log.js")(2),

    // Configuration
    configure: object => require("./lib/config.js")(app, object),

    // Start the server
    start: config => require("./lib/server.js")(app, config),

    // Router
    route: (pattern, handler) =>
      require("./lib/route.js")(app, pattern, handler),

    // Utils
    utils: require("./lib/utils.js"),

    // Middleware
    use: fn => require("./lib/middleware.js").use(app, fn),

    // Plugins
    plugin: (plugin, options) =>
      require("./lib/plugin.js").attach(app, plugin, options)
  };

  // Built-in middleware to extend request and response objects
  app.use((req, res, next) => {
    // Extend request
    app.utils.merge(req, {
      app,
      originalUrl: req.url,
      ...request
    });

    // Extend response
    app.utils.merge(res, {
      app,
      ...response
    });

    next();
  });

  // Request logger middleware
  app.use(loggerMiddleware);

  // Query parameter middleware
  app.use(queryMiddleware);

  // Default configuration
  app.configure({
    host: "127.0.0.1",
    port: 8080,
    views: "/views",
    root: path.dirname(process.mainModule.filename), // Application root path
    env: "development", // Development mode
    version: pkg.version
  });

  return app;
};
