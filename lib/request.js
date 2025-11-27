/**
 * @type {{
 *   get: (this: import("midnight").Request, key: string) => string | undefined;
 *   content: (this: import("midnight").Request) => string | undefined;
 * }}
 */
module.exports = {
  get: function(key) {
    return this.headers[key];
  },
  content: function() {
    return this.headers["Content-Type"];
  }
};
