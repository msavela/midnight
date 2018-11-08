const midnight = require("../../");
const app = midnight();

app.route("/", (req, res) => {
  res.send("Hello world!");
});

app.start();
