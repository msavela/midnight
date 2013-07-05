var app = require('../../');
var connect = require('connect');

var less = require('less-middleware');
var sass = require('node-sass');
var stylus = require('stylus');

// LESS
// /stylesheets/less.css
app.use(less({
	src: app.config.root + '/static'
}));

// SASS
// /stylesheets/sass.css
app.use(sass.middleware({
	src: app.config.root + '/static'
}));

// Stylus
// /stylesheets/stylus.css
app.use(stylus.middleware({
	src: app.config.root + '/static'
}));

// Serve static files
app.use(connect.static(app.config.root + '/static'));

app.start();