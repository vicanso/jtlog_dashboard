'use strict';
var _ = require('lodash');
var async = require('async');
var mongodb = require('../helpers/mongodb');
exports.view = function(req, res, cbf){
  async.waterfall([
    function(cbf){
      mongodb.getLogApps(cbf)
    },
    function(apps, cbf){
      cbf(null, {
        viewData : {
          apps : apps
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
      cbf(null, result.reverse());
    }
  ], cbf);
};