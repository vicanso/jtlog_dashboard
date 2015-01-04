;(function(global){
'use strict';


angular.module('jtApp').factory('jtlog', jtlog);

function jtlog($http, debug){
  debug = debug('jtlog');
  var SOCKET;
  return {
    get : get,
    emit : emit,
    on : on
  };
  function get(app){
    return $http.get('/log/' + app);
  }

  function init(){
    var socket = io();
    socket.on('connect', function(){
      debug('connect');
    });
    socket.on('event', function(data){
      console.dir(data);
    });
    socket.on('disconnect', function(){
      debug('disconnect');
    });
    SOCKET = socket;
  }
  function getSocket(){
    if(!SOCKET){
      init();
    }
    return SOCKET;
  }

  function emit(){
    var socket = getSocket();
    socket.emit.apply(socket, arguments);
  }

  function on(type, fn){
    var socket = getSocket();
    socket.on(type, fn);
  }
}

jtlog.$inject = ['$http', 'debug'];

})(this);