# Midnight [![Build and Test](https://github.com/msavela/midnight/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/msavela/midnight)

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

> npm i midnight

## Typescript Support

Midnight provides first-class Typescript support with comprehensive type definitions. These types are automatically available when you install the package in a Typescript project.

## Examples

### Typescript Example

A basic example demonstrating how to use Midnight.js with Typescript is available in the `examples/typescript` directory.

To run the Typescript example:

```bash
cd examples/typescript
npm install
npm run start:dev
```

## Documentation

See [full documentation](http://msavela.github.io/midnight).
