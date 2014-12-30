;(function(global){
'use strict';


angular.module('jtApp').factory('jtlog', jtlog);

function jtlog($http){
  return {
    get : get
  };

  function get(app){
    return $http.get('/log/' + app);
  }
}

jtlog.$inject = ['$http'];

})(this);