const midnight = require("../../");
const app = midnight();

// /
app.route("/", (req, res) => {
  res.send("Hello world!");
});

// /foo
app
  .route("/foo", (req, res) => {
    res.send("bar");
  })
  .method(["GET", "POST"]);

// /post/{parameter}
app.route("/post/:id", (req, res) => {
  res.send({ params: req.params });
});

// /route/{parameter}
app.route(new RegExp("^\\/route/(?:([^\\/]+?))\\/?$", "i"), (req, res) => {
  res.send({ splats: req.splats });
});

// Route groups

const group = app.route("/group/:group");

// /group/:group
group.route("/", (req, res) => {
  res.send("Route group /");
});

// /group/:group/foo/:id
group.route("/foo/:id", (req, res) => {
  res.send(req.params);
});

// Apply middleware to route group
group.use((req, res, next) => {
  res.set("Has-Parent-Middleware", true);
  next();
});

app.start();
