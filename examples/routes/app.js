var app = require('../../');

// /
app.route('/', function(request, response) {
	response.send('Hello world!');
});

// /post/{parameter}
app.route('/post/:id', function(request, response) {
	response.send(request.params);
});

// /route/{parameter}
app.route(new RegExp('^\\/route\/(?:([^\\/]+?))\\/?$', 'i'), function(request, response) {
	response.send(request.params);
});

app.start();