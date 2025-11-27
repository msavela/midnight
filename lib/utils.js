const fs = require("fs");

module.exports = {
  /**
   * @param {string} html
   * @returns {string}
   */
  escape: html => {
    return String(html)
      .replace(/&(?!\w+;)/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },
  /**
   * @param {object} a
   * @param {object} b
   * @returns {object}
   */
  merge: (a, b) => {
    if (a && b) {
      for (const property in b) {
        a[property] = b[property];
      }
    }
    return a;
  },
  /**
   * @param {string} path
   * @param {(err: NodeJS.ErrnoException, data: string) => void} callback
   */
  readFile: (path, callback) => {
    fs.readFile(path, "utf8", (err, data) => {
      callback(err, data);
    });
  },
  path: {
    /**
     * @param {string|RegExp} path
     * @param {string[]} [keys]
     * @param {boolean} [sensitive]
     * @param {boolean} [strict]
     * @returns {{ re: RegExp, keys: string[] }}
     */
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
