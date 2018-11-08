const assert = require("assert");

const utils = require("./utils");

describe("config", () => {
  it("should set single value", () => {
    const app = utils.createAppSuppressLog();
    app.config.first = true;
    assert.equal(app.config.first, true);
  });

  it("should set multiple values", () => {
    const app = utils.createAppSuppressLog();
    app.configure({
      first: true,
      second: "value"
    });
    assert.equal(app.config.first, true);
    assert.equal(app.config.second, "value");
  });

  it("should set values during startup", () => {
    const app = utils.createAppSuppressLog();
    app.start({
      first: true,
      second: "value"
    });
    assert.equal(app.config.first, true);
    assert.equal(app.config.second, "value");
  });
});
