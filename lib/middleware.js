exports.use = (app, fn) => {
  app.log.debug(`Use middleware ${fn.name || "unknown"}`);
  app.stack.push(fn);
  return app;
};

exports.handle = (app, route, req, res, callback) => {
  const stack = app.stack.slice(0);

  // Include route specific middleware
  if (route) {
    for (const layer of route.stack) {
      stack.push(layer);
    }
  }

  let index = 0;
  const next = err => {
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
