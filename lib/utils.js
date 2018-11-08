const fs = require("fs");

module.exports = {
  escape: html => {
    return String(html)
      .replace(/&(?!\w+;)/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },
  merge: (a, b) => {
    if (a && b) {
      for (const property in b) {
        a[property] = b[property];
      }
    }
    return a;
  },
  readFile: (path, callback) => {
    fs.readFile(path, "utf8", (err, data) => {
      callback(err, data);
    });
  },
  path: {
    normalize: (path, keys = [], sensitive, strict) => {
      if (toString.call(path) === "[object RegExp]") {
        return {
          re: path,
          keys: keys
        };
      }

      path = path
        .concat(strict ? "" : "/?")
        .replace(/\/\(/g, "(?:/")
        .replace(
          /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g,
          (_, slash, format, key, capture, optional, star) => {
            keys && keys.push(key);
            slash = slash || "";
            return (
              "" +
              (optional ? "" : slash) +
              "(?:" +
              (optional ? slash : "") +
              (format || "") +
              (capture || ((format && "([^/.]+?)") || "([^/]+?)")) +
              ")" +
              (optional || "") +
              (star ? "(/*)?" : "")
            );
          }
        )
        .replace(/([\/.])/g, "\\$1")
        .replace(/\*/g, "(.*)");
      return {
        re: new RegExp("^" + path + "$", sensitive ? "" : "i"),
        keys: keys
      };
    }
  }
};
