var log = {
	trace: function() {
		log.log.call(this, arguments, log.level.trace);
	},
	debug: function() {
		log.log.call(this, arguments, log.level.debug);
	},
	info: function() {
		log.log.call(this, arguments, log.level.info);
	},
	warn: function() {
		log.log.call(this, arguments, log.level.warn);
	},
	error: function() {
		log.log.call(this, arguments, log.level.error);
	},
	fatal: function() {
		log.log.call(this, arguments, log.level.fatal);
	},
	log: function(args, level) {
		if(level >= this.config.log) {
			args[0] = '[' + new Date().toISOString() + '] [' + level + '] ' + args[0];
			console.log.apply(console, args);
		}
	},
	level: {
		trace: 0,
		debug: 1,
		info: 2,
		warn: 3,
		error: 4,
		fatal: 5
	}
}

module.exports = log