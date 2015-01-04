var util = require("util");
var events = require("events");

function Emitter(){
  events.EventEmitter.call(this);
}

util.inherits(Emitter, events.EventEmitter);



module.exports = new Emitter();