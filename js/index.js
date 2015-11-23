SC.initialize({
  client_id: 'ddd8d3a316d38bb2e0853693e57781f6',
    redirect_uri: 'http://www.sinelib.com/callback.html'
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

app.controller("songList", ['$scope', 'favorites', 'scUser', '$routeParams', '$timeout', '$filter', function($scope, favorites, scUser, $routeParams, $timeout, $filter){
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
      var artCovers = ['orange','red','blue','green','yellow'];
      var choice = Math.random() * (artCovers.length - 1);
      return artCovers[choice];
   }
   
   $scope.sortSongs = function(){
      //console.log($scope.sortParam);
      if ($scope.sortParam == "hotness"){
         console.log("Applying hotness filter");
         $scope.orderedSongs = $filter('orderBy')($scope.songs, $scope.hotness, $scope.reverse);
      }else{
         $scope.orderedSongs = $filter('orderBy')($scope.songs, $scope.sortParam, $scope.reverse);
      }
   }
   $scope.hotness = function(track){
      var hotFactor = (track.favoritings_count / track.playback_count);
      return hotFactor;
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
   $scope.updateTrackPos = function(){
      if ($scope.musicPlayer){
         //console.log($scope.trackPos);
         var newPos = Math.floor(($scope.trackPos / 300) * $scope.currentTrack.duration);
         console.log("New pos: " + newPos);
         console.log("Diff: " + Math.abs(newPos - $scope.musicPlayer.currentTime()));
         if (Math.abs(newPos - $scope.musicPlayer.currentTime()) > 100){
            $scope.trackPos = newPos;
            $scope.musicPlayer.seek(newPos);
         }

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
         $scope.orderedSongs = preLoadSongs;
         //console.log($scope.songs);
      }
    });
  }
    var likesURL = "http://api.soundcloud.com/users/" + userID + "/favorites.json?limit=100&linked_partitioning=1&page_number=1&client_id=ddd8d3a316d38bb2e0853693e57781f6";
    //'http://api.soundcloud.com/users/1477838/favorites.json?limit=100&linked_partitioning=1&page_number=1&client_id=ddd8d3a316d38bb2e0853693e57781f6'
  if (likesURL && userID){
   getAllLikes(favorites.get(likesURL));
  }
   $scope.reverse = false;
  $scope.soundOn = false;
  $scope.playing = "";
  $scope.musicPlayer = null;
   $scope.loading = false;
   $scope.next = "";
   $scope.trackDuration = 0;
   $scope.prev = "";
   $scope.trackTime = 0;
  $scope.playTrack = function(track, index){     
     if (index != undefined){
        //$scope.next = $scope.orderedSongs[index+1]
        $scope.prev = (index-1 >= 0 ? $scope.orderedSongs[index - 1] : {});
        $scope.next = (index+1 <= $scope.orderedSongs.length ? $scope.orderedSongs[index + 1] : {});
        $scope.index = index;
     }else{
       //$scope.next = $scope.orderedSongs[$scope.index+1];
        $scope.prev = ($scope.index-1 >= 0 ? $scope.orderedSongs[$scope.index - 1] : {});
        $scope.next = ($scope.index+1 <= $scope.orderedSongs.length ? $scope.orderedSongs[$scope.index + 1] : {});
     }
     console.log($scope.index, $scope.next);
    if (track.id){
       var link = '/tracks/' + track.id;
       $scope.currentTrack = track;
       $timeout(function(){
         $scope.playing = track.id;
       },0);
       if (track.id === $scope.playing && $scope.musicPlayer){
           //console.log("Music Player", $scope.musicPlayer);
           if ($scope.soundOn == true){
               console.log("Pausing: " + track.title);
               $scope.musicPlayer.pause();
               $scope.soundOn = false;
           }else{
               console.log("Un-pausing: " + track.title);
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
               if ($scope.next){
                  $scope.soundOn = false;
                  $scope.playTrack($scope.next.id, $scope.next.title, $scope.index+1);
               }
            });
            $scope.musicPlayer.on('time', function(){
               $timeout(function(){
                  $scope.trackTime = new Date($scope.musicPlayer.currentTime());
                  $scope.trackPos = Math.floor(300 * ($scope.musicPlayer.currentTime() / $scope.currentTrack.duration));
                  //console.log($scope.trackPos);
               },0);
            });
            $scope.musicPlayer.play();
         });
       }
    }
  }
}]);

app.directive('songCard', ['$timeout', function($timeout) {
      return {
        restrict: 'E',
         transclude: true,
         templateUrl: 'templates/song-card.html',
         link: function(scope, elem){
            //adding random backgrounds
            var artCovers = ['orange','red','blue','green','yellow'];
            var choice = Math.floor(Math.random() * (artCovers.length - 1));
            scope.coverColor = artCovers[choice];
            //add functionality for next and previous tracks to scope
            scope.$watch('orderedSongs', function(oldVal, newVal){
               //console.log("List reordered");
               if (scope.orderedSongs[scope.$index].id == scope.playing){
                  console.log(scope.$index);
                  //scope.next = scope.orderedSongs[scope.$index+1];
                  $timeout(function(){
                     scope.$parent.prev = (scope.$index-1 >= 0 ? scope.orderedSongs[scope.$index - 1] : scope.orderedSongs[0]);
                     scope.$parent.next = (scope.$index+1 <= scope.orderedSongs.length ? scope.orderedSongs[scope.$index + 1] : scope.orderedSongs[0]);
                     console.log("Next",scope.$parent.next);
                  },0);
               }
            });
         }
      }
}]);