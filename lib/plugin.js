/**
 * @param {import("midnight").App} app
 * @param {import("midnight").Plugin} plugin
 * @param {object} options
 */
exports.attach = (app, plugin, options = {}) => {
  app.log.debug(`Attaching plugin ${plugin.name}`);
  app.plugins.push(plugin);
  plugin.attach(app, options);
};

/**
 * @param {import("midnight").App} app
 * @param {() => void} done
 */
exports.init = (app, done) => {
  let index = 0;
  const next = () => {
    const plugin = app.plugins[index++];
    if (!plugin && done) {
      done();
    } else {
      app.log.debug(`Initialize plugin ${plugin.name}`);
      plugin.init(app, next);
    }
  };
  next();
};
