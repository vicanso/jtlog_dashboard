var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');
var requireTree = require('require-tree');
var client = null;

/**
 * [init 初始化mongodb server]
 * @param  {[type]} uri     [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
var init = function(uri, options){
  options = options || {};
  var defaults = {
    db : {
      native_parser : true
    },
    server : {
      poolSize : 5
    }
  };
  options = _.extend(options, defaults);
  client = mongoose.createConnection(uri, options);
  client.on('connected', function(){
    console.info(uri + ' connected');
  });
  client.on('disconnected', function(){
    console.info(uri + ' disconnected');
  });
};

exports.init = _.once(init);

/**
 * [initModel 初始化单个model]
 * @param  {[type]} model [model的配置信息]
 * @param  {[type]} name  [description]
 * @return {[type]}       [description]
 */
function initModel(model, name){
  var schema = new Schema(model.schema, model.options);
  if(model.indexes){
    _.forEach(model.indexes, function(indexOptions){
      schema.index(indexOptions);
    });
  }
  return client.model(name, schema, model.collection);
}

/**
 * [initModels 初始化models]
 * @param  {[type]} modelPath [description]
 * @return {[type]}           [description]
 */
exports.initModels = function(modelPath){
  if(!client){
    throw new Error('the db is not init!');
  }
  var models = requireTree(modelPath);
  _.forEach(models, function(model, name){
    name = model.name || name;
    name = name.charAt(0).toUpperCase() + name.substring(1);
    initModel(model, name);
  });
};



/**
 * [model 获取model]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
exports.model = function(name){
  if(!client){
    throw new Error('the db is not init!');
  }
  return client.model(name);
};

// log的model配置信息
var logModelOptions = {
  schema : {
    date : {
      type : String,
      required : true
    },
    time : {
      type : String,
      required : true
    },
    msgList : []
  },
  indexes : [
    {
      type : 1
    }
  ]
};

// 记录哪些log model已经初始化
var logModelInitedList = [];

/**
 * [getLogModel 获取log Model]
 * @param  {[type]} collection [description]
 * @return {[type]}            [description]
 */
exports.getLogModel = function(collection){
  if(!client){
    throw new Error('the db is not init!');
  }
  var model = null;
  if(_.indexOf(logModelInitedList, collection) === -1){
    var options = _.clone(logModelOptions);
    options.collection = collection;
    model = initModel(options, collection);
    logModelInitedList.push(collection);
  }else{
    model = exports.model(collection);
  }
  return model;
};


/**
 * [getLogApps 获取log的collection名字列表]
 * @param  {[type]} cbf [description]
 * @return {[type]}     [description]
 */
exports.getLogApps = function(cbf){
  if(!client){
    throw new Error('the db is not init!');
  }
  client.db.collectionNames(function(err, data){
    if(err){
      cbf(err);
    }else{
      var result = [];
      _.forEach(data, function(info){
        var infos = info.name.split('.');
        infos.shift();
        var name = infos.join('.');
        if(_.first(infos) !== 'system'){
          result.push(name);
        }
      });
      cbf(null, result);
    }
  });
};

