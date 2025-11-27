const http = require("http");
const url = require("url");

const plugin = require("./plugin.js");
const middleware = require("./middleware.js").handle;

/**
 * @typedef {import('http').IncomingMessage} Request
 * @typedef {import('http').ServerResponse} Response
 * @typedef {() => void} Next
 * @typedef {(req: Request, res: Response, next: Next) => void} Middleware
 */

/**
 * @param {{ log: any, plugins: any, configure: (config: any) => void, server: http.Server, routes: any[], config: any }} app
 * @param {any} [config]
 */
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

/**
 * @param {{ log: any, config: { host: string, port: number }, server: http.Server, routes: any[] }} app
 */
const listen = app => {
  app.log.info(`Listening at http://${app.config.host}:${app.config.port}`);

  app.server = http.createServer((request, response) => {
    // Find a matching route
    /** @type {{ route: any, params: any, splats: any }} */
    let match;
    /** @type {{ children: boolean, handler: (req: Request, res: Response) => void }} */
    let route;
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
          /** @type {any} */ (request).params = match.params;
          /** @type {any} */ (request).splats = match.splats;

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
