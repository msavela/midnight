const assert = require("assert");
const request = require("supertest");

const utils = require("./utils");

describe("routes", () => {
  describe("basic", () => {
    it("should set route /", done => {
      const app = utils.createAppSuppressLog();

      app
        .route("/", (req, res) => {
          res.end();
        })
        .get();

      request(app.start().server)
        .get("/")
        .expect(200, done);
    });

    it("should set route /test", done => {
      const app = utils.createAppSuppressLog();

      app
        .route("/test", (req, res) => {
          res.end();
        })
        .get();

      request(app.start().server)
        .get("/test")
        .expect(200, done);
    });
  });

  describe("params", () => {
    const app = utils.createAppSuppressLog();

    app.route("/post/:id", (req, res) => {
      res.send(req.params.id);
    });

    app.route("/splats/*.*", (req, res) => {
      res.send(req.splats);
    });

    it("should respond with 45", done => {
      request(app.start().server)
        .get("/post/45")
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.equal(res.text, 45);
          done();
        });
    });

    it("should return splats", done => {
      request(app.start().server)
        .get("/splats/45.json")
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.equal(res.text, '["45","json"]');
          done();
        });
    });

    it("should respond with text", done => {
      request(app.start().server)
        .get("/post/text")
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.equal(res.text, "text");
          done();
        });
    });
  });

  describe("regular expressions", () => {
    const app = utils.createAppSuppressLog();

    app
      .route(new RegExp("^\\/post/(?:([^\\/]+?))\\/?$", "i"), (req, res) => {
        res.send(req.params);
      })
      .get();

    it("should responed with status 200", done => {
      request(app.start().server)
        .get("/post/45")
        .expect(200, done);
    });
  });

  describe("method", () => {
    describe("single method", () => {
      const app = utils.createAppSuppressLog();

      const route = app
        .route("/route", (req, res) => {
          res.end();
        })
        .get();

      it("should accept GET request", done => {
        request(app.start().server)
          .get("/route")
          .expect(200, done);
      });
      it("should reject POST request", done => {
        request(app.start().server)
          .post("/route")
          .expect(404, done);
      });

      it("should contain GET method", () => {
        assert.equal(route.methods.length, 1);
        assert.equal(route.methods[0], "GET");
      });
    });

    describe("multiple methods", () => {
      const app = utils.createAppSuppressLog();

      const route = app
        .route("/route", (req, res) => {
          res.end();
        })
        .get()
        .post();

      it("should accept GET request", done => {
        request(app.start().server)
          .get("/route")
          .expect(200, done);
      });
      it("should accept POST request", done => {
        request(app.start().server)
          .post("/route")
          .expect(200, done);
      });
      it("should allow GET & POST methods", () => {
        assert.equal(route.methods.length, 2);
        assert.equal(route.methods[0], "GET");
        assert.equal(route.methods[1], "POST");
      });
    });

    describe("custom method", () => {
      const app = utils.createAppSuppressLog();

      const route = app
        .route("/route", (req, res) => {
          res.end();
        })
        .method("HEAD");

      it("should accept HEAD request", done => {
        request(app.start().server)
          .head("/route")
          .expect(200, done);
      });
      it("should allow HEAD method", () => {
        assert.equal(route.methods.length, 1);
        assert.equal(route.methods[0], "HEAD");
      });
    });

    describe("multiple custom methods", () => {
      const app = utils.createAppSuppressLog();

      const route = app
        .route("/route", (req, res) => {
          res.end();
        })
        .method(["GET", "HEAD"]);

      it("should accept GET request", done => {
        request(app.start().server)
          .get("/route")
          .expect(200, done);
      });
      it("should accept HEAD request", done => {
        request(app.start().server)
          .head("/route")
          .expect(200, done);
      });
      it("should allow GET & HEAD methods", () => {
        assert.equal(route.methods.length, 2);
        assert.equal(route.methods[0], "GET");
        assert.equal(route.methods[1], "HEAD");
      });
    });

    describe("identical path with multiple route handlers", () => {
      const app = utils.createAppSuppressLog();

      app
        .route("/route", (req, res) => {
          res.send(req.method);
        })
        .get();

      app
        .route("/route", (req, res) => {
          res.send(req.method);
        })
        .post();

      it("should accept GET request", done => {
        request(app.start().server)
          .get("/route")
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            assert.equal(res.text, "GET");
            done();
          });
      });
      it("should accept POST request", done => {
        request(app.start().server)
          .post("/route")
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            assert.equal(res.text, "POST");
            done();
          });
      });
    });

    describe("route groups", () => {
      const app = utils.createAppSuppressLog();

      const group = app.route("/group/:group");

      // Apply middleware to route group
      group.use((req, res, next) => {
        res.set("Has-Parent-Middleware", true);
        next();
      });

      // /group/:group
      group.route("/", (req, res) => {
        res.send("root");
      });

      // /group/:group/foo/:id
      group.route("/foo/:id", (req, res) => {
        res.send(req.params);
      });

      it("should serve group root", done => {
        request(app.start().server)
          .get("/group/4")
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            assert.equal(res.text, "root");
            done();
          });
      });

      it("should serve group subroute", done => {
        request(app.start().server)
          .get("/group/4/foo/2")
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            assert.equal(res.text, '{"group":"4","id":"2"}');
            done();
          });
      });

      it("should apply group middleware", done => {
        request(app.start().server)
          .get("/group/2/foo/1")
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            assert.equal(res.header["has-parent-middleware"], "true");
            done();
          });
      });
    });
  });
});
