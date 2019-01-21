var PORT = 8080;
var http = require('http');

var server = http.createServer(function(req, res) {
res.writeHead(200, {'Content-Type': 'text/plain'});
res.end () ;
});
server.listen(PORT);

console.log('Server running on ' + PORT);
