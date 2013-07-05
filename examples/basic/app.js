var app = require('../../');

app.route('/', function(request, response) {
	response.send('Hello world!');
});

app.start();