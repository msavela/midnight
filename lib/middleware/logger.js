module.exports = (req, res, next) => {
  const started = new Date();
  next();
  req.app.log.info(`${new Date() - started}ms ${req.method} ${req.url}`);
};
