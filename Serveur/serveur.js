var PORT = 8080;
var http = require('http');

httpServer = http.createServer(function(req,res) {
	console.log('une nouvelle connexion');
	res.end('Bienvenue');
});

httpServer.listen(8080);


var io = require('socket.io').listen(httpServer);

console.log('Server running on ' + PORT);
io.sockets.on('connection',function(socket) {

	console.log('Nouveau utilisateur');

});
