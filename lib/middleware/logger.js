/**
 * @typedef {import('../../../index').App} App
 * @typedef {import('http').IncomingMessage} Request
 * @typedef {import('http').ServerResponse} Response
 * @typedef {() => void} Next
 */

/**
 * @param {Request & { app: App }} req
 * @param {Response} res
 * @param {Next} next
 */
module.exports = (req, res, next) => {
  const started = new Date();
  next();
  req.app.log.info(`${new Date() - started}ms ${req.method} ${req.url}`);
};
