(function($){

  var socket = io.connect('http://localhost:8080');
  // Pages du jeu
  var pages = ['home', 'loading_page', 'predict', 'ranking', 'result','game']
  var prediction = 0;

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

  socket.on('beginningame', function(){
    // TODO
    console.log("beginninggame_client")
    navigateTo('game');
  })

  socket.on('finVote', function(){
    // TODO
    console.log("finVote")
    navigateTo('predict');
    //TODO : afficher la bonne question
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
    prediction = $('#slider').data("roundSlider").getValue();
    navigateTo("loading_page");
    $('#loading_message').text(prediction);
  })

})(jQuery);
