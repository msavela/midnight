const url = require("url");
module.exports = (req, res, next) => {
  req.query = url.parse(req.url, true).query;
  next();
};
