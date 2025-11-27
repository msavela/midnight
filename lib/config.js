/**
 * @typedef {import('../index').App} App
 * @typedef {import('../index').Config} Config
 */

/**
 * @param {App} app
 * @param {Partial<Config>} object
 * @returns {App}
 */
module.exports = (app, object) => {
  for (var key in object) {
    app.config[key] = object[key];
  }
  return app;
};
