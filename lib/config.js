module.exports = (app, object) => {
  for (var key in object) {
    app.config[key] = object[key];
  }
  return app;
};
