;(function(global){
'use strict';


angular.module('jtApp')
  .controller('HomePage', HomePage);

function HomePage($scope, $http, $element, $timeout, debug, jtlog) {
  debug = debug('homePage');
  var self = this;
  //标记是否显示该app的log, [app1, app2]
  self.apps = [];

  self.toggle = toggle;

  self.selectedLayout = -1;

  self.result = [];



  /**
   * [toggle 切换是否显示该app的记录]
   * @param  {[type]} app [description]
   * @return {[type]}     [description]
   */
  function toggle(app){
    var apps = self.apps;
    var index = apps.indexOf(app);
    if(!~index){
      apps.push(app);
      getLogs(app, apps.length - 1);
      debug('add app:%s log', app);
    }else{
      apps.splice(index, 1);
      self.result.splice(index, 1);
      debug('remove app:%s log', app);
    }
    // getLogs(self.apps);
  };

  /**
   * [getLogs 获取某个app的logs]
   * @param  {[type]} app   [description]
   * @param  {[type]} index [description]
   * @return {[type]}       [description]
   */
  function getLogs(app, index){
    var tmp = self.result[index];
    if(!tmp){
      tmp = {
        app : app,
        max : 11,
        logs : []
      };
      self.result[index] = tmp;
    }
    return jtlog.get(app).then(function(res){
      res.data.length = 2;
      tmp.logs.push.apply(tmp.logs, res.data);
      $timeout(function(){
        getLogs(app, index);
      }, 1000);

    });
  }

  jtlog.emit('setting', 'setting');
  jtlog.on('log', function(msg){
    // console.dir(msg);
  });

  // getLogs('test', 0);
  // toggle('test');
  // toggle('jtlog_dashboard');
  
  // var socket = io();

  // socket.emit('setting', 'setting');
  // socket.on('log', function(msg){
  //   console.dir(msg);
  // });

}

HomePage.$inject = ['$scope', '$http', '$element', '$timeout', 'debug', 'jtlog'];



})(this);