const midnight = require("../../");
const app = midnight();

const sessionMiddleware = (req, res, next) => {
  req.user = "Steve";
  next();
};

const customHeaderMiddleware = (req, res, next) => {
  res.set("X-Session-User", req.user);
  next();
};

const customOkMiddleware = (req, res, next) => {
  res.send("ok");
  next();
};

app.use(sessionMiddleware);

app.route("/", (req, res) => {
  res.send({ user: req.user });
});

app
  .route("/middleware", (req, res) => {
    res.send(`Hello ${req.user}!`);
  })
  .use(customHeaderMiddleware);

app.route("/alwaysok").use(customOkMiddleware);

app.start();
