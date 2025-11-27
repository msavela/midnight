const url = require("url");

/**
 * @typedef {import('http').IncomingMessage} Request
 * @typedef {import('http').ServerResponse} Response
 * @typedef {() => void} Next
 */

/**
 * @param {Request & { query: object }} req
 * @param {Response} res
 * @param {Next} next
 */
module.exports = (req, res, next) => {
  req.query = url.parse(req.url, true).query;
  next();
};
