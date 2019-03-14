(function($){

  var socket = io.connect('http://localhost:8080');
  // Pages du jeu
  var pages = ['home', 'loading_page', 'predict', 'ranking', 'result','game']

  var prediction = 0;
  var id=0;
  var nombre_oui=0;
  var nombre_votant=0;
  var pourcentage_oui=0;
  var pourcentage_prediction =0;
  var slider = document.getElementById("mySlider");

  $('#form').submit(function(event) {
    event.preventDefault();
    // Si nbjoueurs est éditable et null, on ne fait rien
    if($('#nbjoueur').is(":hidden") || ($('#nbjoueur').val() != null && $('#nbjoueur').val() != '')){
      socket.emit('newuser', $('#namejoueur').val(), $('#nbjoueur').val())
    }else {
      return;
    }
  });

  socket.on('newgame', function(){
    $('#btngame').text('Créer une partie');
  })

  socket.on('joingame', function(){
    $('#btngame').text('Rejoindre une partie');
    $('#nbjoueur').hide();
  })

  socket.on('logged',function(){
  socket.on('waitingothers', function(){
    navigateTo("loading_page");
    $('#loading_message').text('En attente des autres joueurs...');
  })

  socket.on('id_chargement', function(id_c){
    id = id_c;
  })

  socket.on('beginningame', function(nbUsers, question){
    // Initialisation du slider
    slider.max = nbUsers;
    slider.value = slider.max / 2;

    // On initialise la valeur affiché du slider
    $('#currentValue').text(slider.value)

    // A chaque changement de la valeur du slider on met à jour la valeur
    slider.oninput = function() {
      $('#currentValue').text(slider.value)
    }
    $('#questionGame').text(question);
    navigateTo('game');
  })

  socket.on('finVote', function(question){
    navigateTo('predict');
    $('#questionPredict').text(question);
    $('#predictValue').text(slider.value);

  })


  socket.on('finPredict', function(nb_oui, nb_votant, users){
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
    set_progress(vert,rouge);
    var score_tour_int = "Score du tour: "+rouge_int;
    var score_tmp = users[id-1].score + rouge_int
    var score_total_int="Score total: "+ score_tmp;
    $('#score_tour').text(score_tour_int);
    $('#score_total').text(score_total_int);

    navigateTo('result');
    socket.emit('score_tour', rouge_int,id);

  })

  socket.on('goranking',function(users){
    var list = document.getElementById("rankingList");
    for(var i=0;i<users.length;i++){
      var rang = i + 1;
      text = '<tr><th scope="row">' + rang + '</th><td>' + users[i].name + '</td><td>' + users[i].score + '</td></tr>';
      list.innerHTML+=text;
    }
    navigateTo('ranking');
  })

})

  function set_progress(_num,_num2){
    $('#progress').empty();
    var el_1_width=_num;
    var el_2_width=_num2;
    $('#progress').append('<div class="progress-el" style="background-color:green; width:'+el_1_width+'%;">&nbsp;</div>');
    $('#progress').append('<div class="progress-el" style="background-color:red; width:'+el_2_width+'%;">&nbsp;</div>');
  }



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
    $('#loading_message').text('En attente que les autres répondent...');
  })

  $('#btnPredict').click(function () {
    prediction = slider.value;
    socket.emit('predict', prediction);
    navigateTo("loading_page");
    $('#loading_message').text('En attente de la prédiction des autres joueurs...');
  })

  $('#new_question').click(function () {
    socket.emit('new_quest');
    navigateTo("loading_page");
    $('#loading_message').text('En attente de la validation des autres joueurs...');
  })

})(jQuery);
