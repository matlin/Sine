SC.initialize({
  client_id: 'ddd8d3a316d38bb2e0853693e57781f6',
    redirect_uri: 'http://sine.netlifly.com/callback.html'
});

var app = angular.module("sine", ['ngRoute', 'ngCookies']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/login.html',
        controller: 'Login'
      }).
      when('/user/:userID', {
        templateUrl: 'partials/library.html',
        controller: 'songList'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);


app.factory('favorites', ['$http', function($http) {
  return {
    get : function(url){
      return $http.get(url).success(function(data) {
              return data[0];
            }) 
            .error(function(err) { 
              return err; 
            });
    }
  }
}]);

app.factory('scUser', ['$http', function($http){
  return {
    get: function(id){
       if (id != undefined){
            //var url = "http://api.soundcloud.com/users/1477838.json?client_id=ddd8d3a316d38bb2e0853693e57781f6";
           var url = "http://api.soundcloud.com/users/" + id + ".json?client_id=ddd8d3a316d38bb2e0853693e57781f6";
          return $http.get(url).success(function(data){
            return data;
          }).error(function(err){
            return err;
          });
       }else{
         console.error("UserID undefined.");
       }
    },
    search : function(query){
      
    }
  }
}]);

app.controller("Login", ['$scope', '$location', '$cookies', function($scope, $location, $cookies){
    var checkCookie;
    function init() {
      checkCookie();
    }
   checkCookie = function(){
      var id = $cookies.get("sineID");
      if (id){
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
            $cookies.put("sineID", me.id);
            console.log("Directing from " + $location.path() + " to " + path);
            $location.path(path);
            $scope.$apply();
        });
    }
    init();
}]);

app.controller("songList", ['$scope', 'favorites', 'scUser', '$routeParams', '$timeout', function($scope, favorites, scUser, $routeParams, $timeout){
   var scrollBox = $(window);
   var streamBarPos = $('#streamBar').offset();
    angular.element(document).ready(function(){
       if (streamBarPos){
         streamBarPos = streamBarPos.top;
         scrollBox.scroll(function() {
            if (scrollBox.scrollTop() >= streamBarPos){
               $('#streamBar').addClass('scrolled');
            }else {
               $('#streamBar').removeClass('scrolled');
            }
         });
       }
   });
   
   $scope.randColor = function(){
      artCovers = ['orange','red','blue','green','yellow'];
      var choice = Math.random() * (artCovers.length - 1);
      return artCovers[choice];
   }
   
   var userID = $routeParams.userID;
   if (userID){
      scUser.get(userID).success(function(user){
         $scope.user = user;
         console.log(user);
     });
   }else{
      console.log("No user provied");
   }
   $scope.volume = 60;
   $scope.updateVol = function(){
      if ($scope.musicPlayer){
         var newVol = $scope.volume / 100;
         $scope.musicPlayer.setVolume(newVol);
      }
   }
  $scope.updateUser = function(id){
    console.log("Updating userID to: " + id);
    scUser.get(id).success(function(newUser){
        console.log(newUser);
        $scope.user = newUser; 
    });
  }
  var preLoadSongs = [];
  $scope.sortParam = "+";
  function getAllLikes(promise){
    promise.success(function(data){
      preLoadSongs = preLoadSongs.concat(data.collection);
      if (data.next_href){
        getAllLikes(favorites.get(data.next_href));
      }else{
        $scope.songs = preLoadSongs;
         console.log($scope.songs);
      }
    });
  }
    var likesURL = "http://api.soundcloud.com/users/" + userID + "/favorites.json?limit=100&linked_partitioning=1&page_number=1&client_id=ddd8d3a316d38bb2e0853693e57781f6";
    //'http://api.soundcloud.com/users/1477838/favorites.json?limit=100&linked_partitioning=1&page_number=1&client_id=ddd8d3a316d38bb2e0853693e57781f6'
  if (likesURL && userID){
   getAllLikes(favorites.get(likesURL));
  }
  $scope.soundOn = false;
  $scope.playing = "";
  $scope.musicPlayer = null;
   $scope.loading = false;
  $scope.playTrack = function(id, title, next){     
    if (id){
       var link = '/tracks/' + id;
       $scope.currentTrack = title;
       $timeout(function(){
         $scope.playing = id;
       },0);
       if (id === $scope.playing && $scope.musicPlayer){
           //console.log("Music Player", $scope.musicPlayer);
           if ($scope.soundOn == true){
               console.log("Pausing: " + title);
               $scope.musicPlayer.pause();
               $scope.soundOn = false;
           }else{
               console.log("Un-pausing: " + title);
               $scope.musicPlayer.play(); 
               $scope.soundOn = true;
           }
       }else {
         console.log("Getting stream");
         $scope.loading = true; 
         SC.stream(link).then(function(player){
            console.log("Done loading");
            //console.log(player);
            $scope.$apply(function(){
               $scope.musicPlayer = player;
               $scope.updateVol(); //initalizes volume from input
            });
            //next add music player listeners
            $scope.musicPlayer.on('play-start', function(){
               console.log("Stream has started playing.");
               $timeout(function(){
                  $scope.loading = false;
                  $scope.soundOn = true;
               },0);
            });
            $scope.musicPlayer.on('finish', function(){
               if (next){
                  $scope.playTrack(next.id, next.title, {});
               }
            });
            $scope.musicPlayer.play();
         });
       }
    }
  }
}]);

app.directive('songCard', function() {
      return {
        restrict: 'E',
         templateUrl: 'templates/song-card.html'
      }
});