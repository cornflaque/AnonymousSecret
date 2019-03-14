var PORT = 8080;
var http = require("http");

httpServer = http.createServer(function(req,res) {
	res.end("Bienvenue");
});

httpServer.listen(8080);


var io = require("socket.io").listen(httpServer);

console.log("Server running on " + PORT);

var created = false;
var users = new Array;
var nbusers = 0;
var nbVotants = 0;
var nbOui = 0;
var nbPredict = 0;
var nbResult = 0;
var nbTours = 4;
var currentTour = 0;
var questions = [
	"J’ai déjà volé dans un magasin",
	"J’ai déjà eu une contravention",
	"J’ai déjà eu un accident de voiture",
	"J’ai déjà pris l’avion",
	"Je me suis déjà fait arrêter par la police",
	"Je suis déjà resté éveillé plus de 24h d'affilé",
	"J'ai déjà perdu connaissance",
	"J'ai déjà pensé que je suis la plus jolie/le plus beau de ce groupe"
]

function createJoueur(name, score) {

	var id = users.length + 1;
	var joueur = {
		id : id,
		name : name,
		score : score
	}
	return joueur;
}

io.sockets.on("connection",function(socket) {

	if(created && users.length < nbusers){
		socket.emit("joingame");
	}

	socket.on("newuser", function(namejoueur, nbjoueurs, mode_jeu) {

		// First user
		if(!created && nbjoueurs != null){
			nbusers = nbjoueurs;

			// On initialise le score à 0
			users.push(createJoueur(namejoueur, 0));
			socket.emit('logged');
			socket.emit('waitingothers');
			socket.emit('id_chargement',users[users.length-1].id);
			created = true;
			socket.broadcast.emit("joingame");
		}
		else{

			// Joining user
			if(created && users.length < nbusers){
				users.push(createJoueur(namejoueur, 0));
				socket.emit('logged');
				socket.emit('id_chargement',users[users.length-1].id);

				if(users.length == nbusers){
					io.emit("beginningame", nbusers, questions[currentTour]);
				}
				else{
					socket.emit("waitingothers");
				}
			}
		}
})
		//score du tour
		socket.on('score_tour',function(score,id_client)
		{
			users[id_client-1].score += score;
		})

		// Vote du joueur
		socket.on("vote", function (reponse) {
			nbVotants += 1;
			if(reponse) {
				nbOui += 1;}

				if(nbVotants == nbusers){
					io.emit("finVote", questions[currentTour]);
				}
			});

			socket.on("predict", function (prediction) {
				nbPredict += 1;
				if(nbPredict == nbusers){
					io.emit("finPredict",nbOui,nbVotants,users);
				}
			});

			socket.on("new_quest", function () {
				nbResult+=1;
				if(nbResult == nbusers){
					currentTour+=1;
					if(currentTour == nbTours){
						io.emit('goranking',users.sort(function compare(a, b) {
							if (a.score < b.score)
							return -1;
							if (a.score > b.score)
							return 1;
							// a doit être égal à b
							return 0;
						}));
					} else{
						nbVotants = 0;
						nbOui = 0;
						nbPredict = 0;
						nbResult = 0;
						io.emit("beginningame", nbusers, questions[currentTour]);
					}
				}
			});
	});
