const http = require("http");
const url = require("url");

const plugin = require("./plugin.js");
const middleware = require("./middleware.js").handle;

const start = (app, config = {}) => {
  app.configure(config);

  // Initialize plugins and start the server
  if (Object.keys(app.plugins).length > 0) {
    app.log.debug("Initializing plugins.");
    plugin.init(app, () => {
      app.log.debug("All plugins initialized.");
      listen(app);
    });
  } else {
    listen(app);
  }
  return app;
};

const listen = app => {
  app.log.info(`Listening at http://${app.config.host}:${app.config.port}`);

  app.server = http.createServer((request, response) => {
    // Find a matching route
    let match, route;
    for (const r of app.routes) {
      match = r.match(url.parse(request.url).pathname, request.method);
      if (match && !match.route.children) {
        // Match found without children, no need to loop any further
        route = match.route;
        break;
      }
    }

    middleware(app, route, request, response, err => {
      if (err) {
        response.status(500);
        app.config.env === "development"
          ? response.content("text/html").send(`<pre>${err.stack}</pre>`)
          : response.send(err.toString());
      } else {
        if (match && route) {
          request.params = match.params;
          request.splats = match.splats;

          if (route.handler) {
            route.handler(request, response);
          }
        } else {
          response.status(404).send("404");
        }
      }
    });
  });
  app.server.listen(app.config.port, app.config.host);
};

module.exports = start;
