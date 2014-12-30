exports.init = init;

var http = require('http');
var io = null;

function init(app){
  var server = require('http').Server(app);
  io = require('socket.io')(server);
  io.on('connection', function(socket){
    console.dir('......');
  });
}