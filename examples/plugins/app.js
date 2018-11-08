const midnight = require("../../");
const app = midnight();

// Attach the plugin with parameters
// Plugin extends the app with `sky` property
app.plugin(require("./plugin.js"), {
  color: "blue"
});

app.route("/", (req, res) => {
  res.send({
    sky: req.app.sky
  });
});

app.start();
