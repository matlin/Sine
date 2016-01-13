"use strict";
angular.module("sineApp").controller("Login", ['$scope', '$rootScope' , '$location', '$cookies', function($scope, $rootScope, $location, $cookies){
    var checkCookie;
    function init() {
      checkCookie();
    }
   checkCookie = function(){
      var id = $cookies.get("sineID");
      var auth_token = $cookies.get("scAuthToken");
      if (id && auth_token){
            var path = '/user/' + id;
            console.log("Directing from " + $location.path() + " to " + path);
            $location.path(path);
      }
   }
    $scope.startLogin = function(){
        console.log("Authenticating with Soundcloud");
        SC.connect().then(function() {
            return SC.get('/me');
        }).then(function(me) {
            var path = '/user/' + me.id;
            $rootScope.loginID = me.id;
            $rootScope.authToken = SC.getAccessToken();
            $cookies.put("sineID", me.id);
            $cookies.put("scAuthToken", SC.getAccessToken());
            console.log("Directing from " + $location.path() + " to " + path);
            $location.path(path);
            $scope.$apply();
        });
    }
    init();
}]);