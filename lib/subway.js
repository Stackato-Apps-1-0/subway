var irchandler = require('./irchandler'),
  app = require('./webserver').app,
  io = require('socket.io');

var Subway = function() {
  this.app = app;
}

Subway.prototype.start = function () {
  if (this.app.address()) console.log('Subway started on port %s', this.app.address().port);

  sio = io.listen(this.app);
  this.io = sio;

  // fallback to long polling
  // for socket.io
  if(process.env.VCAP_APP_PORT) {
    sio.configure(function () { 
      sio.set("transports", ["xhr-polling"]); 
        sio.set("polling duration", 10); 
    });
  }


  sio.sockets.on('connection', function(socket) {
    irchandler.irchandler(socket);
  });
}

exports.subway = new Subway();
