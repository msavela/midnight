var fs = require('fs');

var utils = {
	// Escape HTML
	escape: function(html) {
		return String(html)
			.replace(/&(?!\w+;)/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	},
	// Merge two objects together
	merge: function(a, b) {
		if (a && b) {
			for (var property in b)
				a[property] = b[property];
		}
		return a;
	},
	// Read a file
	readFile: function(path, callback) {
		fs.readFile(path, 'utf8', function(err, data) {
			callback(err, data);
		});
	},
	// Mimetypes TODO
	mime: {
		text: 'text/plain',
		html: 'text/html',
		json: 'application/json',
	},
	path: {
		normalize: function(path, keys, sensitive, strict) {
			if(toString.call(path) == '[object RegExp]') {
				return path;
			}

			path = path
				.concat(strict ? '' : '/?')
				.replace(/\/\(/g, '(?:/')
				.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star) {
					keys && keys.push(key);
					slash = slash || '';
					return ''
						+ (optional ? '' : slash)
						+ '(?:'
						+ (optional ? slash : '')
						+ (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
						+ (optional || '')
						+ (star ? '(/*)?' : '');
				})
				.replace(/([\/.])/g, '\\$1') //
				.replace(/\*/g, '(.*)'); //
			return new RegExp('^' + path + '$', sensitive ? '' : 'i');
		}
	}
}

module.exports = utils