"use strict";
angular.module("sineApp").controller("Login", ['$scope', '$rootScope' , '$location', '$cookies', function($scope, $rootScope, $location, $cookies){
    var checkCookie, addUser;
    function init() {
      checkCookie();
    }
   checkCookie = function(){
      var id = $cookies.get("sineID");
      var auth_token = $cookies.get("scAuthToken");
      if (id && auth_token){
            addUser();
            var path = '/user/' + id;
            console.log("Directing from " + $location.path() + " to " + path);
            $location.path(path);
      }
   }
   addUser = function(userObj){
      //store user in Parse
            var user = new Parse.User();
            user.set("userID", userObj.id);
            user.set("username", userObj.username);
            user.set("password", userObj.id);

            user.signUp(null, {
              success: function(user) {
                // Hooray! Let them use the app now.
                 console.log("Added user.", user);
              },
              error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
              }
            });
   }
   var me = {
      'id' : '1477838',
      'username' : 'matthewlinkous'
   };
   addUser(me);
    $scope.startLogin = function(){
        console.log("Authenticating with Soundcloud");
        SC.connect().then(function() {
            return SC.get('/me');
        }).then(function(me) {
            var path = '/user/' + me.id;
            $rootScope.loginID = me.id;
            $rootScope.authToken = SC.getAccessToken();
            
            addUser(me);
            
            $cookies.put("sineID", me.id);
            $cookies.put("scAuthToken", SC.getAccessToken());
            console.log("Directing from " + $location.path() + " to " + path);
            $location.path(path);
            $scope.$apply();
        });
    }
    init();
}]);