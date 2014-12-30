;(function(global){
'use strict';
var app = angular.module('jtApp');

app.directive('jtLogView', jtLogView);

function jtLogView($compile, $parse){
  function appendLogs(obj, app, logs){
    var htmlArr = [];
    angular.forEach(logs, function(log){
      var type = log[1];
      var typeHtml = '';
      var cssClass = 'log';
      var time = '<span class="time">' + log.substring(log.length - 23) + '</span>';
      switch(type){
        case 'E':
          typeHtml = '<i class="glyphicon glyphicon-exclamation-sign"></i>';
          cssClass += ' error';
        break;
        case 'W':
          typeHtml = '<i class="glyphicon glyphicon-exclamation-sign"></i>';
          cssClass += ' warn';
        break;
        default:
          typeHtml = '<i class="glyphicon glyphicon-info-sign"></i>';
          cssClass += ' info';
        break;
      }
      var html = '<div class="' + cssClass + '">' +
        '<span class="name">' + app + '</span>' +
        // typeHtml +
        log.substring(3, log.length - 23) +
        time +
      '</div>';
      htmlArr.push(html);
    });
    obj.html(htmlArr.join(''));
    // obj.prop('scrollTop', 99999);
  }
  return {
    link : function(scope, element, attr, ctrl){
      scope.$watch(attr.jtLogView, function(v){
        if(v){
          var length = v.logs.length;
          var max = v.max;
          if(length > max){
            v.logs = v.logs.slice(length - max);
            return
          }
          appendLogs(element, v.app, v.logs);
        }
      }, true);
    }
  }
}

jtLogView.$inject = ['$compile', '$parse'];



app.directive('jtLayout', jtLayout);
function jtLayout(){
  return {
    link : function(scope, element, attr, ctrl){
      var oldValue = -1;
      scope.$watch(attr.jtLayout, function(v){
        if(v != oldValue){
          element.removeClass('layout' + oldValue);
          element.addClass('layout' + v);
          oldValue = v;
        }
      });
    }
  }
}

})(this);