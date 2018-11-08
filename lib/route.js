const path = require("path");

const newRoute = (app, pattern, handler, stack) => {
  app.log.info(`Route: ${pattern}`); // TODO: debug
  const route = Route(app, pattern, handler, stack);
  app.routes.push(route);
  return route;
};

const Route = (app, pattern, handler, stack = []) => {
  const route = {
    app: app,
    pattern: pattern,
    handler: handler,
    methods: [],
    stack: stack, // Inherit parent group middleware stack
    children: false, // Has subroutes

    // Populate `re` and `keys`
    ...app.utils.path.normalize(pattern, []),

    method: method => {
      if (typeof method === "string") {
        route.methods.push(method);
      } else if (method instanceof Array) {
        route.methods.push(...method);
      }
      return route;
    },

    get: () => {
      route.methods.push("GET");
      return route;
    },
    post: () => {
      route.methods.push("POST");
      return route;
    },
    put: () => {
      route.methods.push("PUT");
      return route;
    },
    delete: () => {
      route.methods.push("DELETE");
      return route;
    },

    // Assign route specific middleware
    use: fn => {
      app.log.debug(`Use middleware '${fn.name}' for route ${pattern}`);
      route.stack.push(fn);
      return route;
    },

    // Subroute (route group)
    route: (pattern, handler) => {
      const fullPattern =
        typeof pattern === "string"
          ? path.join(route.pattern, pattern)
          : pattern;
      route.children = true; // This route has children
      return newRoute(app, path.resolve(fullPattern), handler, route.stack);
    },

    match: (path, method) => {
      if (route.methods.length === 0 || route.methods.indexOf(method) != -1) {
        const params = {};
        const splats = [];

        const captures = path.match(route.re);
        if (captures) {
          for (let i = 1; i < captures.length; ++i) {
            const key = route.keys[i - 1];
            const value =
              typeof captures[i] === "string"
                ? unescape(captures[i])
                : captures[i];

            if (key) {
              params[key] = value;
            } else {
              splats.push(value);
            }
          }
          return {
            route: route,
            params: params,
            splats: splats
          };
        }
      }
      return;
    }
  };
  return route;
};

module.exports = newRoute;
