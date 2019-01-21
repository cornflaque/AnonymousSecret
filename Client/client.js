require('bootstrap');
(function($){

  var socket = io.connect('http://localhost:8080');


  $('#loginform').submit(function(event){
    event.preventDefault();
    socket.emit('login', {
      username  : $('#username').val(),
      mail    : $('#mail').val()
    });
  })

})(jQuery);
