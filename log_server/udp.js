'use strict';
var dgram = require('dgram');
var _ = require('lodash');
var util = require('util');
var async = require('async');
var db = require('./db');
var servers = {};
exports.listen = listen;



function listen(port){
  port = +port;
  var server = servers[port];
  if(!server){
    server = createServer(port);
  }
  return server;
}

function createServer(port){
  var server = dgram.createSocket('udp4');
  var infos = {
    server : server,
    status : 'disconnected'
  };
  servers[port] = infos;
  server.on('listening', function(){
    var address = server.address();
    console.log(util.format('udp server listening on %s:%d', address.address, address.port));
    infos.status = 'connected';
  });
  server.on('close', function(){
    infos.status = 'disconnected';
  });
  server.on('message', function(msg){
    msg = msg.toString();
    var index = msg.indexOf('|');
    if(index != -1){
      db.add(msg.substring(0, index), msg.substring(index + 1));
    }
  });

  server.bind(port);
}