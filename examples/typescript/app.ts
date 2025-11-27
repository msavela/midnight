import midnight, { Request, Response, Next } from "midnight";

const app = midnight();

// Configure the application
app.configure({
  host: "127.0.0.1",
  port: 3000,
  env: "development"
});

// Custom middleware
app.use((req: Request, res: Response, next: Next) => {
  app.log.info("Custom middleware executed!");
  next();
});

// Basic route
app.route("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript example!");
});

// Route with parameters
app.route("/users/:id", (req: Request, res: Response) => {
  res.send(`User ID: ${req.params.id}`);
});

// Route with query parameters (uses built-in query middleware)
app.route("/search", (req: Request, res: Response) => {
  res.send(`Search query: ${req.query.q}`);
});

// Start the server
app.start(app.config);

app.log.info(`TypeScript example server running on http://${app.config.host}:${app.config.port}`);