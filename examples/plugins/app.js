var app = require('../../');

// Attach the plugin with optional parameters
app.attach(require('./plugin.js'));

// Use the custom template engine
app.engine(app.engines.custom);

app.route('/', function(request, response) {
	response.render('index.html', { hello: 'Hello world!' });
});

app.start();