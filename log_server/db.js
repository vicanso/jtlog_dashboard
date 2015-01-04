
exports.add = add;

var mongodb = require('../helpers/mongodb');
var _ = require('lodash');
var async = require('async');
var logDict = {};
var saveInterval = 10 * 1000;
var emitter = require('./emitter');

/**
 * [save 保存数据（定时对log保存到数据库，间隔10s）]
 * @return {[type]} [description]
 */
function save(){
  _.forEach(logDict, function(logs, name){
    var result = {};
    _.forEach(logs, function(log){
      var key = log.substring(log.length - 23, log.length - 7);
      if(!result[key]){
        result[key] = [];
      }
      result[key].push(log);
    });
    _.forEach(result, function(logs, key){
      var infos = key.split(' ');
      var date = infos[0];
      var time = infos[1];
      if(!date || !time){
        return ;
      }
      var options = {
        collection : name,
        conditions : {
          date : date,
          time : time
        },
        update : {
          '$pushAll' : {
            msgList : logs
          }
        }
      };
      updateQueue.push(options);
    });
  });
  logDict = {};
  _.delay(save, saveInterval);
}

/**
 * [update 更新数据库]
 * @param  {[type]} collection [description]
 * @param  {[type]} conditions [description]
 * @param  {[type]} update     [description]
 * @param  {[type]} cbf        [description]
 * @return {[type]}            [description]
 */
function update(collection, conditions, update, cbf){
  var Model = mongodb.getLogModel(collection);
  var options = {
    upsert : true,
    multi : false
  };
  Model.update(conditions, update, options, cbf);
}

// 更新队列
var updateQueue = async.queue(function(task, cbf){
  update(task.collection, task.conditions, task.update, cbf);
}, 20);


/**
 * [add 添加一条log]
 * @param {[type]} name [description]
 * @param {[type]} msg  [description]
 */
function add(name, msg){
  if(!logDict[name]){
    logDict[name] = [];
  }
  logDict[name].push(msg);
  emitter.emit(name, msg);
}

_.delay(save, saveInterval);

setInterval(function(){
  add('test', '[I][helpers/monitor:44] lag.vicanso.0 2014-12-31 13:58:40.101');
}, 5000);
