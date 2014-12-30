'use strict';
var path = require('path');
var program = require('commander');
var url = require('url');
program.version('0.0.1')
  .option('-p, --port <n>', 'listen port', parseInt)
  .option('--mongodb <n>', 'mongodb uri eg.mongodb://localhost:10020/test, mongodb://user:pwd@localhost:10020/test')
  .option('--redis <n>', 'redis uri eg.redis://localhost:10010, redis://pwd@localhost:10010')
  .option('--stats <n>', 'stats uri eg.stats://localhost:6000')
  .parse(process.argv);


exports.port = program.port || 10000;

exports.env = process.env.NODE_ENV || 'development';

exports.app = 'jtlog_dashboard';

exports.process = process.env.jtProcessName || 'vicanso';

// 静态文件url前缀
exports.staticUrlPrefix = '/static';

exports.staticPath = path.join(__dirname, 'statics');

exports.staticHosts = exports.env === 'development'? null : ['s1.vicanso.com', 's2.vicanso.com'];

// redis服务器的配置
exports.redis = (function(){
  var urlInfo = url.parse(program.redis || 'redis://localhost:10010');
  return {
    port : +urlInfo.port,
    host : urlInfo.hostname,
    password : urlInfo.auth
  };
})();

// stats服务器的配置
exports.stats = (function(){
  var urlInfo = url.parse(program.stats || 'stats://localhost:6000');
  return {
    port : +urlInfo.port,
    host : urlInfo.hostname
  };
})();

// session的配置
exports.session = {
  secret : 'jenny&tree',
  key : 'vicanso',
  ttl : 3600 * 12
};


// mongodb服务器的连接uri
exports.mongodbUri = program.mongodb || 'mongodb://localhost:10020/log';