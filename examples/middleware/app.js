var app = require('../../');
var connect = require('connect');

app.use(connect.query());

app.route('/', function(request, response) {
	response.send(request.query);
});

// Echo JSON body with POST request and Content-Type application/json
app.route('/middleware', function(request, response) {
	response.send(request.body);
}).post().use(connect.json());

app.start();