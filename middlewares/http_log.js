'use strict';
var morgan = require('morgan');
module.exports = function(type){
  return morgan(type, {
    stream : {
      write : function(msg){
        console.log(msg.trim());
      }
    }
  });
};