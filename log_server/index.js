var udp = require('./udp');

exports.listen = listen;


function listen(type, port){
  switch(type){
    case 'udp':
      udp.listen(port);
    break;
  }
}