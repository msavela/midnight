# Midnight [![Build Status](https://travis-ci.org/msavela/midnight.svg)](https://travis-ci.org/msavela/midnight)

Midnight is an open source web framework for node.js without external dependencies.

```js
const midnight = require("midnight");
const app = midnight();

app.route("/", (req, res) => {
  res.send("Hello world!");
});

app.start();
```

## Installation

> yarn add midnight

## Documentation

See [full documentation](http://msavela.github.io/midnight).
