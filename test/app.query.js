const assert = require("assert");
const request = require("supertest");

const utils = require("./utils");

describe("plugin", () => {
  describe("basic", () => {
    it("should attack simple plugin", done => {
      const app = utils.createAppSuppressLog();

      app.route("/route", (req, res) => {
        res.send(req.query);
      });

      request(app.start().server)
        .get("/route?foo=bar")
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.equal(res.text, '{"foo":"bar"}');
          done();
        });
    });
  });
});
