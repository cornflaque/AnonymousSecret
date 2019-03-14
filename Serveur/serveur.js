var PORT = 8080;
var http = require("http");

httpServer = http.createServer(function(req,res) {
	console.log("une nouvelle connexion");
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
var nbTours = 5;
var currentTour = 1;
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

io.sockets.on("connection",function(socket) {


	//score du tour
socket.on('score_tour',function(score,id_client)
{
	users[id_client-1].score += score;
	  console.log("score="+users[id_client-1].score);
})

	// Faire une tempo pour la page de résultat intermédiaire


	if(created && users.length < nbusers){
		socket.emit("joingame");
	}
	console.log("Nouveau utilisateur");

	socket.on("newuser", function(namejoueur, nbjoueurs, mode_jeu){

		console.log("Name : "+namejoueur+"   nbjoueurs : "+nbjoueurs);
		// First user
		if(!created && nbjoueurs != null){
			console.log("premier joueur")
			nbusers = nbjoueurs;

			// On initialise le score à 0
			users.push(createJoueur(namejoueur, 0));
			console.log(users);
			socket.emit('waitingothers');
			socket.emit('id_chargement',users[users.length-1].id);
			created = true;
			socket.broadcast.emit("joingame");
		}
		else{

			// Joining user
			if(created && users.length < nbusers){
				console.log("Joining user")
				users.push(createJoueur(namejoueur, 0));
				console.log(users);
				socket.emit('id_chargement',users[users.length-1].id);

				if(users.length == nbusers){
					console.log("beginninggame")
					io.emit("beginningame");
				}
				else{
					console.log("on attend les autres");
					socket.emit("waitingothers");
				}
			}
		}
	})

	// Vote du joueur
	socket.on("vote", function (reponse) {
		nbVotants += 1;
		if(reponse) {
			nbOui += 1;}

		if(nbVotants == nbusers){
			io.emit("finVote", nbusers, questions[currentTour]);
		}
	});

	socket.on("predict", function (prediction) {
		nbPredict += 1;
		console.log("prediction : " + prediction);
		if(nbPredict == nbusers){
			io.emit("finPredict");
			io.emit('nombre_oui_envoy',nbOui,nbVotants);
		}
	});

	socket.on('finPartie', function(){
		socket.broadcast.emit('goranking',users.sort(function compare(a, b) {
			  if (a.score < b.score)
			     return -1;
			  if (a.score > b.score)
			     return 1;
			  // a doit être égal à b
			  return 0;

			}));
		});


});
