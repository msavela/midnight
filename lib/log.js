const LEVEL = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5
};

module.exports = (l = LEVEL.info) => {
  let loglevel = l;

  const logger = (clog, args, level) => {
    level >= loglevel &&
      clog.apply(
        console,
        [`${new Date().toISOString()} [${level}]`].concat(args)
      );
  };

  return {
    trace: (...args) => logger(console.trace, args, LEVEL.trace),
    debug: (...args) => logger(console.debug, args, LEVEL.debug),
    info: (...args) => logger(console.info, args, LEVEL.info),
    warn: (...args) => logger(console.warn, args, LEVEL.warn),
    error: (...args) => logger(console.error, args, LEVEL.error),
    fatal: (...args) => logger(console.error, args, LEVEL.fatal),
    level: level => {
      loglevel = level;
    }
  };
};
