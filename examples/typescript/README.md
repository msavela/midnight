# TypeScript Example for Midnight.js

This directory contains an example application demonstrating how to use the Midnight.js framework with TypeScript.

## Getting Started

To run this example, ensure you have Node.js and npm (or yarn) installed.

### Build

First, navigate to the example directory:

```bash
cd examples/typescript
```

Then, install the dependencies and build the TypeScript code:

```bash
npm install
npm run build
```

This will compile `app.ts` into `dist/app.js`.

### Run

After building, you can start the application using the `start:dev` script:

```bash
npm run start:dev
```

This command will rebuild the project and then run the compiled `dist/app.js` using Node.js.

The application will typically start on `http://127.0.0.1:8080`. You can test the routes:
- `http://127.00.1:8080/`
- `http://127.0.0.1:8080/users/123`
- `http://127.0.0.1:8080/search?q=typescript`
