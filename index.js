const path = require("path");
const request = require("./lib/request.js");
const response = require("./lib/response.js");

const loggerMiddleware = require("./lib/middleware/logger");
const queryMiddleware = require("./lib/middleware/query");

const VERSION = "0.2.0";

/**
 * @typedef {import("midnight").Request} Request
 * @typedef {import("midnight").Response} Response
 * @typedef {import("midnight").Next} Next
 * @typedef {import("midnight").Middleware} Middleware
 * @typedef {import("midnight").Route} Route
 * @typedef {import("midnight").Plugin} Plugin
 * @typedef {import("midnight").Logger} Logger
 * @typedef {import("midnight").App} App
 * @typedef {import("midnight").Config} Config
 */

/**
 * @type {() => import("midnight").App}
 */
module.exports = () => {
  /** @type {import("midnight").App} */
  const app = {
    stack: [],
    routes: [],
    plugins: [],
    cache: {},
    config: {},
    globals: {
      title: `Midnight ${VERSION}`,
    },
    log: require("./lib/log.js")(2),

    // Configuration
    configure: function (object) {
      return require("./lib/config.js")(this, object);
    },

    // Start the server
    start: function (config) {
      return require("./lib/server.js")(this, config);
    },

    // Router
    route: function (pattern, handler) {
      return require("./lib/route.js")(this, pattern, handler);
    },

    // Utils
    utils: require("./lib/utils.js"),

    // Middleware
    use: function (fn) {
      return require("./lib/middleware.js").use(this, fn);
    },

    // Plugins
    plugin: function (plugin, options) {
      return require("./lib/plugin.js").attach(this, plugin, options);
    },
  };

  // Built-in middleware to extend request and response objects
  app.use((req, res, next) => {
    // Extend request
    app.utils.merge(req, {
      app,
      originalUrl: req.url,
      ...request,
    });

    // Extend response
    app.utils.merge(res, {
      app,
      ...response,
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
    root: path.dirname(require.main.filename), // Application root path
    env: "development", // Development mode
    version: VERSION,
  });

  return app;
};
