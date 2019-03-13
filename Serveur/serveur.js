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
var nbVotants = 0;
var nbOui = 0;

// Fonction pour naviguer entre les pages
function createJoueur(name, score) {

	var id = users.length + 1;
	var joueur = {
		id : id,
		name : name,
		score : score
	}
	return joueur;
}

io.sockets.on('connection',function(socket) {

	// Faire une tempo pour la page de résultat intermédiaire


  //Vote du joueur
	socket.on('vote', function (boolean) {
			nbVotants = nbVotants + 1;
			if(boolean) {nbOui = nbOui + 1;}
			if(nbVotants == nbusers){socket.broadcast.emit('finVote');}
      console.log('Joueur a voter: ' + boolean);

    });

	if(created && users.length < nbusers){
		socket.emit('joingame');
	}
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

			// On initialise le score à 0
			users.push(createJoueur(namejoueur, 0));
			console.log(users);
			socket.emit('waitingothers');
			created = true;
			socket.broadcast.emit('joingame');
		}
		else{

			// Joining user
			if(created && users.length < nbusers){
				console.log("Joining user")
				users.push(createJoueur(namejoueur, 0));
				console.log(users);			if(users.length == nbusers){
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

//TODO : réussir a intégrer le code de predict.js dans le client ou le serveur
//TODO : configurer le nombre max du slider pour être le nombre de joueur
