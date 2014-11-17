var midnight = require('../'),
	assert = require('assert');

describe('config', function() {
	it('should set single value', function() {
		var app = midnight();
		app.config.first = true;
		assert.equal(app.config.first, true);
	});

	it('should set multiple values', function() {
		var app = midnight();
		app.configure({
			first: true,
			second: 'value'
		});
		assert.equal(app.config.first, true);
		assert.equal(app.config.second, 'value');
	});

	it('should set values during startup', function() {
		var app = midnight();
		app.start({
			first: true,
			second: 'value'
		});
		assert.equal(app.config.first, true);
		assert.equal(app.config.second, 'value');
	});
});