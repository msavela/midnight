/**
 * @type {{
 *   status: (this: import("midnight").Response, code: number) => import("midnight").Response;
 *   set: ((this: import("midnight").Response, field: string, value: string) => import("midnight").Response) &
 *        ((this: import("midnight").Response, fields: Record<string, string>) => import("midnight").Response);
 *   content: ((this: import("midnight").Response, type: string) => import("midnight").Response) &
 *            ((this: import("midnight").Response) => string | undefined);
 *   get: (this: import("midnight").Response, field: string) => string | undefined;
 *   redirect: (this: import("midnight").Response, url: string) => import("midnight").Response;
 *   encoding: (this: import("midnight").Response, type: string) => import("midnight").Response;
 *   render: (this: import("midnight").Response & { app: import("midnight").App }, view: string, locals?: object, options?: object) => void;
 *   send: (this: import("midnight").Response, body: any) => void;
 * }}
 */
module.exports = {
  status: function(status) {
    this.statusCode = status;
    return this;
  },
  set: function(key, value) {
    if (!value) {
      if (typeof key === "string") {
        this.removeHeader(key);
      } else if (typeof key === "object") {
        for (const header in key) {
          this.set(header, key[header]);
        }
      }
    } else if (typeof key === "string") {
      this.setHeader(key, value);
    }
    return this;
  },
  content: function(content) {
    if (content) {
      this.set("Content-type", content);
    } else {
      return this.get("Content-Type");
    }
    return this;
  },
  get: function(key) {
    return this.getHeader(key);
  },
  redirect: function(location) {
    this.status(302);
    this.set("Location", location);
    return this;
  },
  encoding: function(encoding) {
    if (this.content().indexOf("charset") !== -1) {
      this.content(this.content().split(";")[0] + ";charset=" + encoding);
    } else {
      this.content(this.content() + ";charset=" + encoding);
    }
    return this;
  },
  render: function(template, variables, options) {
    this.app.render(template, variables, options, data => {
      this.send(data);
    });
  },
  send: function(response) {
    if (Buffer.isBuffer(response)) {
      this.content("application/octet-stream");
      this.set("Content-Length", Buffer.byteLength(response));
    } else {
      if (typeof response === "string") {
        this.content("text/html");
      } else if (Array.isArray(response) || typeof response === "object") {
        this.content("application/json");
        response = JSON.stringify(response);
      }
      this.set("Content-Length", response.length);
    }
    this.end(response);
  }
};
