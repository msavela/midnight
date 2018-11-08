const midnight = require("../");

exports.createAppSuppressLog = () => {
  const app = midnight();
  app.log = {
    trace: () => {},
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
    fatal: () => {}
  };
  return app;
};

exports.basicMiddleware = (req, res, next) => {
  req.beforeProperty = true;
  res.beforeProperty = true;
  next();
};

exports.simplePlugin = {
  name: "simple-plugin",
  attach: (app, options = {}) => {
    this.options = options;
    app.log.info("Plugin attached");
  },
  init: (app, next) => {
    app.sky = this.options.color;
    app.log.info("Plugin ready");
    next();
  }
};
