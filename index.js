var JTCluster = require('jtcluster');
var config = require('./config');
function initServer(){
  var app = require('./app');
  app.start();
}

if(config.env === 'development'){
  initServer();
}else{
  new JTCluster({
    handler : initServer,
    envs : [
      {
        jtProcessName : 'tiger'
      },
      {
        jtProcessName : 'cuttlefish'
      }
    ]
  });
}