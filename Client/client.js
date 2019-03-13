(function($){

  var socket = io.connect('http://localhost:8080');
  // Pages du jeu
  var pages = ['home', 'loading_page', 'predict', 'ranking', 'result','game']

  $('#form').submit(function(event) {
    event.preventDefault();
    // TODO : prevenir si nbjoeurs est null
    socket.emit('newuser', $('#namejoueur').val(), $('#nbjoueur').val())
    navigateTo('loading_page')
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
  })

  $('#btn_non').click(function () {
    socket.emit('vote', false);
    navigateTo("loading_page");
  })

})(jQuery);
