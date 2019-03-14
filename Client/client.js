(function($){

  var socket = io.connect('http://localhost:8080');
  // Pages du jeu
  var pages = ['home', 'loading_page', 'predict', 'ranking', 'result','game']

  var prediction = 2;
  var id=0;
  var nombre_oui=0;
  var nombre_votant=0;
  var pourcentage_oui=0;
  var pourcentage_prediction =0;

  $('#form').submit(function(event) {
    event.preventDefault();
    // TODO : prevenir si nbjoeurs est null
    socket.emit('newuser', $('#namejoueur').val(), $('#nbjoueur').val())
    navigateTo('loading_page');
    $('#loading_message').text('En attente des autres joueurs...');
  });

  socket.on('newgame', function(){
    $('#btngame').text('Créer une partie');
  })

  socket.on('joingame', function(){
    $('#btngame').text('Rejoindre une partie');
    $('#nbjoueur').hide();
  })

  socket.on('waitingothers', function(){
    console.log("waiting");
    navigateTo("loading_page");
    $('#loading_message').text('En attente des autres joueurs...');
  })

  socket.on('id_chargement', function(id_c){
  id = id_c;
})

  socket.on('beginningame', function(){
    // TODO
    console.log("beginninggame_client")
    navigateTo('game');
  })

  socket.on('finVote', function(nbUsers, question){
    navigateTo('predict');
    $('#mySlider').append('<input type="range" min="0" max="' + nbUsers + '" value="50" class="slider" id="myRange">')
    $('#questionPredict').text(question);
    $('#predictValue').text($('#mySlider').value);
  })

  socket.on('finPredict', function(){
    navigateTo('result');
  })

  socket.on('nombre_oui_envoy', function(nb_oui, nb_votant){
    // TODO
    nombre_oui=nb_oui;
    nombre_votant=nb_votant;
    var vert =0;
    var rouge = 0;
    var rouge_int=0;
    if(prediction>nombre_oui)
    {
      vert = nombre_oui/nombre_votant*100;
      rouge_int=prediction-nombre_oui;
      rouge = (prediction-nombre_oui)/nombre_votant*100;
    }

    if(prediction<nombre_oui)
    {
      vert =prediction/nombre_votant*100;
      rouge_int=nombre_oui-prediction;
      rouge = (nombre_oui-prediction)/nombre_votant*100;
    }
    if(prediction==nombre_oui)
    {
      vert =prediction/nombre_votant*100;
      rouge = 0;
    }
    console.log("pour="+vert);
    set_progress(vert,rouge);


    navigateTo('result');
    socket.emit('score_tour', rouge_int,id);
})

function set_progress(_num,_num2){
	$('#progress').empty();
	var el_1_width=_num;
	var el_2_width=_num2;
//	var el_3_width=0;
//	var el_4_width=0;
//if(_num>30){el_1_width=30;}else{el_1_width=_num;}
//	if(_num>60){el_2_width=30;}else{el_2_width=_num-el_1_width;}
//	if(_num>80){el_3_width=30;}else{el_3_width=_num-el_1_width-el_2_width;}
//	if(_num>90){el_4_width=_num-90;}
//	var new_font_clor='';
//	if(_num<55){new_font_clor='color:black';}
//	$('#progress').append('<div class="progress-text" style="'+new_font_clor+'">'+_num+' %</div>');
	$('#progress').append('<div class="progress-el" style="background-color:green; width:'+el_1_width+'%;">&nbsp;</div>');
	$('#progress').append('<div class="progress-el" style="background-color:red; width:'+el_2_width+'%;">&nbsp;</div>');
//	$('#progress').append('<div class="progress-el" style="background-color:yellow; width:'+el_3_width+'%;">&nbsp;</div>');
//	$('#progress').append('<div class="progress-el" style="background-color:red; width:'+el_4_width+'%;">&nbsp;</div>');

}

  socket.on('goranking',function(users){
  	var list = document.getElementById("todo-list");
  	for(var i=0;i<users.length;i++){
  		text = "<li><tr> <th scope=\"row\">"+i+"</th> <td>"+users[i].name+"</td> <td>"+users[i].score+"</td> </tr></li>";
  		//text = "<li>"+users[i].score+"<input onclick=\"remTache(this)\" type=\"button\" value=\"Supprimer\"></li>";
  		list.innerHTML+=text;
  	}
  	navigateTo('ranking')
  })

  // Fonction pour naviguer entre les pages
  function navigateTo(page) {
    // Si la page existe, on affiche celle-ci et on cache toutes les autres
    if(pages.includes(page)){
    pages.forEach(function(element) {
      if(element===page){
      $('#'+element).show();
    }
      else{
      $('#'+element).hide();
    }
    });
  }
    // Sinon on ne fait rien
    else{
      console.log("La page "+page+" n'existe pas");
    }
  }

  $('#btn_oui').click(function () {
      socket.emit('vote', true);
      navigateTo("loading_page");
      $('#loading_message').text('En attente que les autres répondent...');
  })

  $('#btn_non').click(function () {
    socket.emit('vote', false);
    navigateTo("loading_page");
  })

  $('#btnPredict').click(function () {
    prediction = $('#mySlider').value;
    socket.emit('predict');
    navigateTo("loading_page");
    $('#loading_message').text(prediction);
  })

})(jQuery);
