var app = require('../../');

app.engine(app.engines.hogan);

app.route('/', function(request, response) {
	response.render('index.html', { world: 'world!' });
});

app.start();