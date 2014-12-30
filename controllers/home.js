'use strict';
var _ = require('lodash');
var async = require('async');
var mongodb = require('../helpers/mongodb');
exports.view = function(req, res, cbf){
  var layouts = [
    '一行',
    '两行',
    '三行',
    '四行',
    '五行',
    '两列',
    '三列',
    '一行两列',
    '两行两列',
    '三行两列'
  ]
  async.waterfall([
    function(cbf){
      mongodb.getLogApps(cbf)
    },
    function(apps, cbf){
      cbf(null, {
        viewData : {
          apps : apps.concat(['test1', 'test3']),
          layouts : layouts
        }
      });
    }
  ], cbf);
};

exports.get = function(req, res, cbf){
  var app = req.param('app');
  async.waterfall([
    function(cbf){
      mongodb.getLogModel(app).find({}, cbf);
    },
    function(docs, cbf){
      var result = [];
      _.forEach(docs, function(doc){
        doc = doc.toObject();
        result.push.apply(result, doc.msgList);
      });
      cbf(null, result);
    }
  ], cbf);
};