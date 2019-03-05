var PORT = 8080;
var http = require('http');

httpServer = http.createServer(function(req,res) {
	console.log('une nouvelle connexion');
	res.end('Bienvenue');
});

httpServer.listen(8080);


var io = require('socket.io').listen(httpServer);

console.log('Server running on ' + PORT);

var created = false;
var users = new Array;
var nbusers = 0;

io.sockets.on('connection',function(socket) {

	console.log('Nouveau utilisateur');

	socket.on("newuser", function(namejoueur, nbjoueurs){
		// 3 cas
		// Cas 1 : premier nbjoueur
		// Cas 2 : joueur qui rejoint
		// Cas 3 : joueur en trop
	console.log('Name : '+namejoueur+'   nbjoueurs : '+nbjoueurs);
		// First user
		if(!created && nbjoueurs != null){
			console.log("premier joueur")
			nbusers = nbjoueurs;
			users.push(namejoueur);
			socket.emit('waitingothers');
			created = true;
			socket.broadcast.emit('joingame');
		}
		else{

		// Joining user
		if(created && users.length < nbusers){
			console.log("Joining user")
			users.push(namejoueur);
			if(users.length == nbusers){
				console.log("beginninggame")
				socket.broadcast.emit('beginningame');
			}
			else{
				console.log("on attend les autres");
				socket.emit('waitingothers');
			}
		}
}
	})
});
