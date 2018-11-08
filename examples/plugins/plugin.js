// Sky color plugin
module.exports = {
  name: "sky-plugin",
  attach: (app, options = {}) => {
    this.options = options;
  },
  init: (app, next) => {
    app.sky = this.options.color;
    next();
  }
};
