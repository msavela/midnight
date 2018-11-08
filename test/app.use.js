const assert = require("assert");
const request = require("supertest");

const utils = require("./utils");

describe("middleware", () => {
  describe("basic", () => {
    it("global middleware", done => {
      const app = utils.createAppSuppressLog();

      app.use(utils.basicMiddleware);

      app.route("/", (req, res) => {
        assert.equal(req.beforeProperty, true);
        assert.equal(res.beforeProperty, true);
        res.end();
      });

      request(app.start().server)
        .get("/")
        .expect(200, done);
    });

    describe("local(route) middleware", () => {
      const app = utils.createAppSuppressLog();

      app.route("/", (req, res) => {
        assert.equal(req.beforeProperty, undefined);
        assert.equal(res.beforeProperty, undefined);
        res.end();
      });

      app
        .route("/foo", (req, res) => {
          assert.equal(req.beforeProperty, true);
          assert.equal(res.beforeProperty, true);
          res.end();
        })
        .use(utils.basicMiddleware);

      it("should respond 200", done => {
        request(app.start().server)
          .get("/")
          .expect(200, done);
      });

      it("should respond 200", done => {
        request(app.start().server)
          .get("/foo")
          .expect(200, done);
      });
    });
  });

  describe("advanced", () => {
    it("should apply after properties", done => {
      const app = utils.createAppSuppressLog();

      let afterProperty = false;
      app.use((req, res, next) => {
        next();
        afterProperty = true;
      });

      app.route("/", (req, res) => {
        assert.equal(afterProperty, false);
        res.end();
      });

      request(app.start().server)
        .get("/")
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.equal(afterProperty, true);
          done();
        });
    });

    it("should respond without route handler", done => {
      const app = utils.createAppSuppressLog();

      app.route("/foo").use((req, res, next) => {
        res.send("ok");
        next();
      });

      request(app.start().server)
        .get("/foo")
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.equal(res.text, "ok");
          done();
        });
    });
  });
});
