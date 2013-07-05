var app = require('../../');
var connect = require('connect');

// Try requesting /
app.use(connect.static(app.config.root + '/static'));

app.start();