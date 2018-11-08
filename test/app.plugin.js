const assert = require("assert");
const request = require("supertest");

const utils = require("./utils");

describe("plugin", () => {
  describe("basic", () => {
    it("should attack simple plugin", done => {
      const app = utils.createAppSuppressLog();

      app.plugin(utils.simplePlugin, {
        color: "blue"
      });

      app.route("/", (req, res) => {
        res.send(req.app.sky);
      });

      request(app.start().server)
        .get("/")
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert.equal(res.text, "blue");
          done();
        });
    });
  });
});
