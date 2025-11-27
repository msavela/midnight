/**
 * @typedef {import('http').IncomingMessage} Request
 * @typedef {import('http').ServerResponse} Response
 * @typedef {() => void} Next
 * @typedef {(req: Request, res: Response, next: Next) => void} Middleware
 */

/**
 * @param {{ log: any, stack: Middleware[] }} app
 * @param {Middleware} fn
 */
exports.use = (app, fn) => {
  app.log.debug(`Use middleware ${fn.name || "unknown"}`);
  app.stack.push(fn);
  return app;
};

/**
 * @param {{ stack: Middleware[], log: any }} app
 * @param {{ stack: Middleware[] }} route
 * @param {Request} req
 * @param {Response} res
 * @param {(err?: Error) => void} callback
 */
exports.handle = (app, route, req, res, callback) => {
  const stack = app.stack.slice(0);

  // Include route specific middleware
  if (route) {
    for (const layer of route.stack) {
      stack.push(layer);
    }
  }

  let index = 0;
  /**
   * @param {Error} [err]
   */
  const next = (err) => {
    // Next layer
    const layer = stack[index++];

    // Stack done
    if (!layer || res.headerSent) {
      if (callback) {
        return callback(err);
      }
      return;
    }

    try {
      app.log.trace(`Process middleware ${layer.name || "unknown"}`);
      if (err) {
        if (layer.length === 4) {
          layer(err, req, res, next);
        } else {
          next(err);
        }
      } else if (layer.length < 4) {
        layer(req, res, next);
      } else {
        next();
      }
    } catch (e) {
      next(e);
    }
  };
  next();
};
