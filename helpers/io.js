exports.init = init;

var http = require('http');
var io = null;
var logEmitter = require('../log_server/emitter');

function init(app){
  var http = require('http').Server(app);
  io = require('socket.io')(http);

  // var server = require('http').Server(app);
  // io = require('socket.io')(server);
  io.on('connection', function(socket){
    console.dir('user connect...');
    socket.on('disconnect', function(){
      console.dir('user disconnected');
    });
    socket.on('setting', function(msg){
      console.dir(msg);
    });
    socket.emit('log', 'test log');
  });
  logEmitter.on('test', function(msg){
    console.dir('.....xxxx');
    console.dir(msg);
  });
  return http;
}


function settingHandler = function(msg){
  var data;
  try{
    data = JSON.parse(msg); 
  }catch(err){

  }
  if(data){
    
  }
}