const midnight = require("../");
const assert = require("assert");

describe("utils", function() {
  describe("path", function() {
    describe("normalize", function() {
      it("/", function() {
        var app = midnight();
        var keys = [];
        var route = app.utils.path.normalize("/", keys);
        assert.notEqual(route.re.exec("/"), null);
        assert.equal(keys.length, 0);
      });
      it("/hello", function() {
        var app = midnight();
        var keys = [];
        var route = app.utils.path.normalize("/hello", keys);
        assert.notEqual(route.re.exec("/hello"), null);
        assert.equal(keys.length, 0);
      });
      it("/post/:id", function() {
        var app = midnight();
        var keys = [];
        var route = app.utils.path.normalize("/post/:id", keys);
        assert.notEqual(route.re.exec("/post/45"), null);
        assert.equal(keys.length, 1);
      });
      it("/post/:id?", function() {
        var app = midnight();
        var keys = [];
        var route = app.utils.path.normalize("/post/:id?", keys);
        assert.notEqual(route.re.exec("/post"), null);
        assert.notEqual(route.re.exec("/post/"), null);
        assert.notEqual(route.re.exec("/post/45"), null);
        assert.equal(keys.length, 1);
      });
      it("/post/:id.:format?", function() {
        var app = midnight();
        var keys = [];
        var route = app.utils.path.normalize("/post/:id.:format?", keys);
        assert.notEqual(route.re.exec("/post/45"), null);
        assert.notEqual(route.re.exec("/post/45.json"), null);
        assert.equal(keys.length, 2);
      });
      it("/post/*", function() {
        var app = midnight();
        var keys = [];
        var route = app.utils.path.normalize("/post/*", keys);

        assert.notEqual(route.re.exec("/post/"), null);
        assert.notEqual(route.re.exec("/post/"), null);
        assert.notEqual(route.re.exec("/post/24"), null);
        assert.notEqual(route.re.exec("/post/45/test"), null);

        assert.equal(keys.length, 0);
      });
      it("/post/*.*", function() {
        var app = midnight();
        var keys = [];
        var route = app.utils.path.normalize("/post/*.*", keys);

        assert.notEqual(route.re.exec("/post/24.json"), null);
        assert.notEqual(route.re.exec("/post/45/details.xml"), null);

        assert.equal(keys.length, 0);
      });

      it("should accept named regular expressions", function() {
        var app = midnight();
        var keys = [];
        var route = app.utils.path.normalize("/lang/:lang([a-z]{2})", keys);
        assert.notEqual(route.re.exec("/lang/en"), null);
        assert.equal(route.re.exec("/lang/45"), null);
        assert.equal(route.re.exec("/lang/eng"), null);
        assert.equal(keys.length, 1);
      });

      it("should accept raw regular expressions", function() {
        var app = midnight();
        var keys = [];
        var route = app.utils.path.normalize(
          new RegExp("^\\/route/(?:([^\\/]+?))\\/?$", "i"),
          keys
        );
        var match = route.re.exec("/route/whatever");
        assert.notEqual(match, null);
        assert.equal(keys.length, 0);
      });

      it("should be case-insensitive", function() {
        var app = midnight();
        var route = app.utils.path.normalize("/Route");
        assert.notEqual(route.re.exec("/route"), null);
        assert.notEqual(route.re.exec("/Route"), null);
      });
      it("should be case-sensitive", function() {
        var app = midnight();
        var route = app.utils.path.normalize("/Route", null, true);
        assert.equal(route.re.exec("/route"), null);
        assert.notEqual(route.re.exec("/Route"), null);
      });
      it("should not be strict", function() {
        var app = midnight();
        var route = app.utils.path.normalize("/route");
        assert.notEqual(route.re.exec("/route"), null);
        assert.notEqual(route.re.exec("/route/"), null);
      });
      it("should be strict", function() {
        var app = midnight();
        var route = app.utils.path.normalize("/route", null, false, true);
        assert.notEqual(route.re.exec("/route"), null);
        assert.equal(route.re.exec("/route/"), null);
      });
    });
  });
});
