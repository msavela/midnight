// Type definitions for the 'midnight' package

import { IncomingMessage, ServerResponse } from 'http';

// --- Request and Response Interfaces ---
interface MidnightRequest extends IncomingMessage {
  get(key: string): string | undefined;
  content(): string | undefined;
  params: { [key: string]: string | undefined }; // Parameters can be undefined
  query: { [key: string]: string | string[] | undefined }; // Query params can be string or string[]
  app: MidnightApp;
  originalUrl: string;
}

interface MidnightResponse extends ServerResponse {
  app: MidnightApp;
  status(code: number): this;
  set(field: string, value: string): this;
  set(fields: Record<string, string>): this;
  content(type: string): this;
  content(): string | undefined;
  get(field: string): string | undefined;
  redirect(url: string): this;
  encoding(type: string): this;
  render(view: string, locals?: object, options?: object): void;
  send(body: any): void;
}

type MidnightNext = (err?: any) => void;
type MidnightMiddleware = (req: MidnightRequest, res: MidnightResponse, next: MidnightNext) => void;

// --- Config Interface ---
interface MidnightConfig {
  host: string;
  port: number;
  views: string;
  root: string;
  env: string;
  version: string;
}

// --- Logger Interface ---
interface MidnightLogger {
  trace: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  fatal: (...args: any[]) => void;
  level: (level: number) => void;
}

// --- Route Interface ---
interface MidnightRoute {
  app: MidnightApp;
  pattern: string;
  handler: (req: MidnightRequest, res: MidnightResponse) => void;
  methods: string[];
  stack: MidnightMiddleware[];
  children: boolean;
  re: RegExp;
  keys: string[];
  method(method: string | string[]): MidnightRoute;
  get(): MidnightRoute;
  post(): MidnightRoute;
  put(): MidnightRoute;
  delete(): MidnightRoute;
  use(fn: MidnightMiddleware): MidnightRoute;
  route(pattern: string, handler: (req: MidnightRequest, res: MidnightResponse) => void): MidnightRoute;
  match(path: string, method: string): { route: MidnightRoute, params: { [key: string]: string }, splats: string[] } | undefined;
}

// --- Plugin Interface ---
interface MidnightPlugin {
  name: string;
  attach: (app: MidnightApp, options: object) => void;
  init: (app: MidnightApp, next: () => void) => void;
}

// --- App Interface ---
interface MidnightApp {
  stack: MidnightMiddleware[];
  routes: MidnightRoute[];
  plugins: MidnightPlugin[];
  cache: object;
  config: Partial<MidnightConfig>;
  globals: { title: string };
  log: MidnightLogger;
  configure(object: Partial<MidnightConfig>): MidnightApp;
  start(config: Partial<MidnightConfig>): MidnightApp;
  route(pattern: string, handler: (req: MidnightRequest, res: MidnightResponse) => void): MidnightRoute;
  utils: {
    merge: (obj1: object, obj2: object) => object;
    path: { normalize: (pattern: string, keys: string[]) => { re: RegExp, keys: string[] } };
  };
  use(fn: MidnightMiddleware): MidnightApp;
  plugin(plugin: MidnightPlugin, options: object): MidnightApp;
}

// Declare the main factory function for the 'midnight' package
declare function createMidnightApp(): MidnightApp;

// Augment the createMidnightApp function's namespace with named types
declare namespace createMidnightApp {
  export type Request = MidnightRequest;
  export type Response = MidnightResponse;
  export type Next = MidnightNext;
  export type Middleware = MidnightMiddleware;
  export type App = MidnightApp;
  export type Logger = MidnightLogger;
  export type Route = MidnightRoute;
  export type Plugin = MidnightPlugin;
}

// This makes createMidnightApp the CommonJS default export
export = createMidnightApp;

// Also augment the global NodeJS namespace for IncomingMessage and ServerResponse
// if midnight extends them directly (which it does in index.js app.use)
declare global {
  namespace NodeJS {
    interface IncomingMessage extends Partial<MidnightRequest> {}
    interface ServerResponse extends Partial<MidnightResponse> {}
  }
}
