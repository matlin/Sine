SC.initialize({
  client_id: 'ddd8d3a316d38bb2e0853693e57781f6',
    redirect_uri: 'http://www.sinelib.com/callback.html'
});

var app = angular.module("sine", ['ngRoute', 'ngCookies', 'ui.bootstrap']);

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


app.factory('scCollection', ['$http', function($http) {
   
  function get(id, collection){
      var destination = [];
      var validCollections = ['favorites', 'tracks']; //just append list with valid options
      if (validCollections.indexOf(collection) != -1){ 
          var URL = "http://api.soundcloud.com/users/" + id + "/" + collection + ".json?limit=50&linked_partitioning=1&page_number=1&client_id=ddd8d3a316d38bb2e0853693e57781f6";
         return getRest(URL, destination);
      }else{
        console.error("Could not retrieve collection called '" + collection + "'");
      }
   }
   
   function getRest(url, destination){
      return  $http.get(url).then(function(response){
         var data = response.data;
         destination = destination.concat(data.collection);
         if (data.next_href){
            return getRest(data.next_href, destination);
         }else{
            return destination;
         }
       });
  }
                                                    
   return {
    get : get,
    getRest: getRest
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
        var url = 'https://api.soundcloud.com/users/?q='+query+'&format=json&client_id=ddd8d3a316d38bb2e0853693e57781f6';
        $http.get(url).then(function(response){
            return response.map(function(user){
                return user.username;
            });
        });
    }
  }
}]);

app.controller("Login", ['$scope', '$rootScope' , '$location', '$cookies', function($scope, $rootScope, $location, $cookies){
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

app.controller("songList", ['$scope', '$rootScope', 'scCollection', 'scUser', '$routeParams', '$timeout', '$filter', '$location', '$cookies', function($scope, $rootScope, scCollection, scUser, $routeParams, $timeout, $filter, $location, $cookies){
    function init(){
        //check for id and authcookies
        if (!$rootScope.authToken){
            var token = $cookies.getObject('favIds');
            $rootScope.authToken = $cookies.get('scAuthToken');
        }
        if (SC.isConnected() == false && $rootScope.authToken){
            SC.setAccessToken($rootScope.authToken);
        }
        if (!$rootScope.favoriteIDs && sessionStorage.favIDs){
            $rootScope.favoriteIDs = sessionStorage.favIDs;
        }
        //add scrolling player bar functionality
        var scrollBox = $(window);
        var streamBarPos = $('#streamBar').offset();
        angular.element(document).ready(function(){
           if (streamBarPos){
             streamBarPos = streamBarPos.top;
             scrollBox.scroll(function() {
                if (scrollBox.scrollTop() >= streamBarPos){
                   $('#streamBar').addClass('scrolled');
                   $('#queueWindow').addClass('scrolled');
                }else {
                   $('#streamBar').removeClass('scrolled');
                   $('#queueWindow').removeClass('scrolled');
                }
             });
           }
            //add playing and pausing with spacebar functionality
           scrollBox.keydown(function(e){
               //32 = spacebar code
             if (e.keyCode === 32 && document.activeElement.tagName != 'INPUT'){
                e.preventDefault();
                if ($rootScope.musicPlayer && !$scope.pausing){
                    $scope.pausing = true;
                   $scope.playTrack($rootScope.currentTrack, $rootScope.index);
                    $timeout(function(){
                        $scope.pausing = false;
                    }, 500);
                }
             }
           });
       });
    }
    init();
   /*$location.on('locationChangeStart', function(){
      console.log("Going to new page");
   });*/
   
   $scope.randColor = function(){
      var artCovers = ['orange','red','blue','green','yellow'];
      var choice = Math.random() * (artCovers.length - 1);
      return artCovers[choice];
   }
   
   $scope.searchUser = function(query){
      SC.get('/users/', {
         q: query
      }).then(function(users){
         console.log(users[0].username);
         var id = users[0].id;
         var path = '/user/' + id;
         $location.path(path);
      });
   }
   
   $scope.sortSongs = function(pred){
      if ($scope.sortParam == pred){
         $scope.reverse = !$scope.reverse;
      }
      $scope.sortParam = pred;
      $scope.orderedSongs = $filter('orderBy')($scope.songs, $scope.sortParam, $scope.reverse);
   }
   
   $scope.hotness = function(track){
      var hotFactor = (track.favoritings_count / track.playback_count);
      return hotFactor;
   }
   
   $scope.updateVol = function(){
      if ($rootScope.musicPlayer){
         var newVol = $rootScope.volume / 100;
         $rootScope.musicPlayer.setVolume(newVol);
      }
   }
   $scope.updateTrackPos = function(){ //move into a directive for trackPositioning for better implementation
      if ($rootScope.musicPlayer){
         //console.log($rootScope.trackPos);
         var newPos = Math.floor(($rootScope.trackPos / 300) * $rootScope.currentTrack.duration);
         console.log("New pos: " + newPos);
         console.log("Diff: " + Math.abs(newPos - $rootScope.musicPlayer.currentTime()));
         if (Math.abs(newPos - $rootScope.musicPlayer.currentTime()) > 100){
            $rootScope.trackPos = newPos;
            $rootScope.musicPlayer.seek(newPos);
         }

      }
   }
   $scope.updateCollection = function(collection){
       $scope.currentCollection = collection;
       $scope.orderedSongs = null;
       //change to switch cases when added more collections
       if (collection == 'favorites'){
            if (!$scope.favorites){
                scCollection.get($scope.artistID, collection).then(function(tracks){
                    $scope.orderedSongs = tracks;
                    $scope.songs = tracks;
                    $scope.favorites = tracks;
                    //add favorite IDs to scope for checking whether song is favorited
                    if ($scope.artistID == $rootScope.loginID){
                         console.log("Favorites loading up.");
                         $rootScope.favoriteIDs =[];
                        //change to javascript map function (!)
                         $.each(tracks, function(i, track){
                            $rootScope.favoriteIDs.push(track.id);
                         });
                        sessionStorage.favIDs = $rootScope.favoriteIDs;
                        //$cookies.putObject('favIDs', {'favorites' : $rootScope.favoriteIDs}); //cookie not big enough
                    }
                });
            }else{
                $scope.orderedSongs = $scope.favorites;
                $scope.songs = $scope.favorites;
            }
       }else if(collection == 'tracks'){
            if (!$scope.tracks){
                scCollection.get($scope.artistID, collection).then(function(tracks){
                    $scope.orderedSongs = tracks;
                    $scope.songs = tracks;
                    $scope.tracks = tracks;
                });
            }else{
                $scope.orderedSongs = $scope.tracks;
                $scope.songs = $scope.tracks;
            }
       }
   };
  $scope.updateUser = function(id){
    console.log("Updating userID to: " + id);
    scUser.get(id).success(function(newUser){
        console.log(newUser);
        $scope.user = newUser; 
    });
  };
    
  $scope.artistID = $routeParams.userID;
   if ($scope.artistID){
      scUser.get($scope.artistID).success(function(user){
         $scope.user = user;
         $scope.currentCollection = (user.public_favorites_count > user.track_count ? 'favorites' : 'tracks');
         console.log(user);
         $scope.updateCollection($scope.currentCollection);
     });
   }else{
      console.log("No user provided");
   }
  /*if ($scope.artistID){
     scCollection.get($scope.artistID, 'favorites').then(function(result){
      $scope.songs = result;
      $scope.orderedSongs = result;
        //change to more robust solution in login (!)
     });
  }*/
   if (!$rootScope.loaded){
      console.log("Initializing");
      $rootScope.reverse = false;
      $rootScope.soundOn = false;
      $rootScope.playing = "";
      $rootScope.volume = 60;
      $rootScope.musicPlayer = null;
      $scope.sortParam = "+";
      $rootScope.loading = false;
      $rootScope.next = "";
      $scope.trackDuration = 0;
      $scope.prev = "";
      $rootScope.trackTime = 0;
      $rootScope.trackPos = 0;
      $rootScope.queue = [];
      $scope.displayQueue=false;
      if (!$rootScope.loginID){
         //change to dynamic solution
         $rootScope.loginID = 1477838;
      }
   }{
      console.log("Skipping initialization");
      $rootScope.loaded = true;
   }
   $scope.setQueue = function(){
      if ($scope.filteredSongs){
         $rootScope.queue = $scope.filteredSongs;
      }
   };
  $scope.getRelatedTracks = function(trackID){
      var url = "https://api-v2.soundcloud.com/tracks/" + trackID + "/related";
      return $http.get(url).done(function(tracks){
        return tracks;
      });
  };
  $scope.playTrack = function(track, index){
    if (track && track.id){
      if (index != undefined){
        //$rootScope.next = $scope.orderedSongs[index+1]
        $scope.prev = (index-1 >= 0 ? $rootScope.queue[index - 1] : {});
        $rootScope.next = (index+1 <= $rootScope.queue.length ? $rootScope.queue[index + 1] : {});
        $rootScope.index = index;
      }else{
       //$rootScope.next = $scope.orderedSongs[$rootScope.index+1];
        $scope.prev = ($rootScope.index-1 >= 0 ? $rootScope.queue[$rootScope.index - 1] : {});
        $rootScope.next = ($rootScope.index+1 <= $rootScope.queue.length ? $rootScope.queue[$rootScope.index + 1] : {});
      }
       var link = '/tracks/' + track.id;
       $rootScope.currentTrack = track;
       $timeout(function(){
         $rootScope.playing = track.id;
          //sessionStorage.playing = track.id;
       },0);
       if (track.id === $rootScope.playing && $rootScope.musicPlayer){
           //console.log("Music Player", $rootScope.musicPlayer);
           if ($rootScope.soundOn == true){
               console.log("Pausing: " + track.title);
               $rootScope.musicPlayer.pause();
               $rootScope.soundOn = false;
               //sessionStorage.soundOn = false;
           }else{
               console.log("Un-pausing: " + track.title);
               $rootScope.musicPlayer.play(); 
               $rootScope.soundOn = true;
              //sessionStorage.soundOn = true;
           }
       }else {
         console.log("Getting stream");
         $rootScope.loading = true;
          //fill queue
          //$rootScope.queue = $scope.filteredSongs;
          //console.log("Queue", $rootScope.queue);
         SC.stream(link).then(function(player){
            //sessionStorage.musicPlayer = player;
            console.log("Done loading");
            //console.log(player);
            $scope.$apply(function(){
               $rootScope.musicPlayer = player;
               $scope.updateVol(); //initalizes volume from input
            });
            //next add music player listeners
            $rootScope.musicPlayer.on('play-start', function(){
               console.log("Stream has started playing.");
               $timeout.cancel($scope.playbackTimeout);
               $timeout(function(){
                  $rootScope.loading = false;
                  $rootScope.soundOn = true;
                  //sessionStorage.soundOn = true;
               },0);
            });
            $rootScope.musicPlayer.on('finish', function(){
               if ($rootScope.next){
                  $rootScope.soundOn = false;
                  //sessionStorage.soundOn = false;
                  $scope.playTrack($rootScope.next, $rootScope.index+1);
               }
            });
            $rootScope.musicPlayer.on('time', function(){
               if (!$scope.seekingTrack){
                $timeout(function(){
                     $rootScope.trackTime = new Date($rootScope.musicPlayer.currentTime());
                     $rootScope.trackPos = Math.floor(300 * ($rootScope.musicPlayer.currentTime() / $rootScope.currentTrack.duration));
                     //console.log($rootScope.trackPos);
                  },1);
               }
            });
            $rootScope.musicPlayer.on('no_protocol', function(){
               window.alert("This track is currently not supported, likely because it uses Flash audio.");
            });
            $rootScope.musicPlayer.on('audio_error', function(){
               window.alert("An error as occured during playback. Please refresh page and try again.");
            });
            $rootScope.musicPlayer.on('no_connection', function(){
               window.alert("Something went wrong when connecting to stream. PLease refresh page and try again.");
            });
            //$rootScope.musicPlayer.play();
            player.play();
            $scope.playbackTimeout = $timeout(function(){
               $rootScope.musicPlayer = null;
               $rootScope.loading = false;
               window.alert("Song could not be played.");
               $scope.playTrack($rootScope.next, $rootScope.index+1);
            }, 10000);
            console.log($rootScope.musicPlayer);
         }).catch(function(e){
            console.error("Error in stream.", e);
         });;
       }
    }
  }
}]);

app.filter('highlight', function($sce) {
    return function(text, phrase) {
      if (phrase) text = text.replace(new RegExp('('+phrase+')', 'gi'),
        '<span class="highlighted">$1</span>')

      return $sce.trustAsHtml(text)
    }
});

app.directive('songCard', ['$timeout', '$rootScope', function($timeout, $rootScope) {
      return {
        restrict: 'E',
         transclude: true,
         templateUrl: 'templates/song-card.html',
         link: function(scope, elem){
            function reColor(){
               //adding random backgrounds
               var artCovers = ['orange','red','blue','green','yellow'];
               //var choice = Math.floor(Math.random() * (artCovers.length - 1));
               var choice = Math.floor(scope.$index % artCovers.length);
               scope.coverColor = artCovers[choice];
            }
            if ($rootScope.favoriteIDs){
                scope.favorited = ($rootScope.favoriteIDs.indexOf(scope.song.id) === -1 ? false : true);
            }
            scope.favoriteTrack = function(){
               if(SC.isConnected()){
                  if (scope.favorited){
                     SC.delete('/me/favorites/' + scope.song.id).then(function(){
                        console.log("Disliking track.");
                         $timeout(function(){
                            scope.favorited = false;
                         }, 0);
                     });   
                  }else{
                     SC.put('/me/favorites/' + scope.song.id).then(function(){
                        console.log("Liking track.");
                        $timeout(function(){
                            scope.favorited = true;
                         }, 0);
                     });
                  }
               }else{
                  console.log("User not authenticated.");
                   window.alert("You are not logged in. Go to www.sinelib.com to login.");
                  //add popup for login service (!)
               }
            }
            //change root scope queue
            //console.log(elem.find('button.play')[0]);
            /*$(elem.find('button.play')[0]).click(function(){
               console.log("Setting queue");
               $rootScope.queue = scope.filteredSongs;
            });*/
            //add orderChecking for search filter (maybe using filterSongs variable)
            scope.$watch('orderedSongs', function(oldVal, newVal){
               //console.log("List reordered");
               reColor();
               /*if (scope.orderedSongs[scope.$index].id == scope.playing){
                  console.log(scope.$index);
                  //scope.next = scope.orderedSongs[scope.$index+1];
                  $timeout(function(){
                     scope.$parent.index = scope.$index;
                     scope.$parent.prev = (scope.$index-1 >= 0 ? scope.orderedSongs[scope.$index - 1] : scope.orderedSongs[0]);
                     scope.$parent.next = (scope.$index+1 <= scope.orderedSongs.length ? scope.orderedSongs[scope.$index + 1] : scope.orderedSongs[0]);
                     console.log("Next",scope.$parent.next);
                  },0);
               }*/
            });
         }
      }
}]);

app.directive('trackTimeline', ['$timeout', '$rootScope', function($timeout, $rootScope){
   return {
      restrict: 'A',
      transclude: true,
      link: function(scope, elem){
         $(elem).mousedown(function(){
            scope.seekingTrack = true;
         });
         $(elem).mouseup(function(){
            console.log("Click");
            if (scope.musicPlayer){
               //console.log(scope.trackPos);
               var newPos = Math.floor((scope.trackPos / 300) * $rootScope.currentTrack.duration);
               console.log("New pos: " + newPos);
               //console.log("Diff: " + Math.abs(newPos - scope.musicPlayer.currentTime()));
               if (Math.abs(newPos - scope.musicPlayer.currentTime()) > 1000){
                  $rootScope.trackPos = newPos;
                  $rootScope.musicPlayer.seek(newPos);
               }
            }
            scope.seekingTrack = false;
         })
      }
   }
}]);

app.directive('userSearch', ['$rootScope', function($rootScope){
   return {
      restrict: 'E',
      templateUrl: 'templates/user-search.html',
      link: function(scope, elem){
         var substringMatcher = function(strs) {
            return function findMatches(q, cb) {
               var matches, substringRegex;
                // an array that will be populated with substring matches
                matches = [];
                // regex used to determine if a string contains the substring `q`
                substrRegex = new RegExp(q, 'i');
                // iterate through the pool of strings and for any string that
                // contains the substring `q`, add it to the `matches` array
                $.each(strs, function(i, str) {
                  if (substrRegex.test(str)) {
                    matches.push(str);
                  }
                });
                cb(matches);
            };
         };
         var SCUsers = new Bloodhound({
           datumTokenizer: Bloodhound.tokenizers.obj.whitespace('username'),
           queryTokenizer: Bloodhound.tokenizers.whitespace,
           prefetch: 'http://api.soundcloud.com/users/' + $rootScope.loginID + '/followings.json?client_id=ddd8d3a316d38bb2e0853693e57781f6',
           remote: {
             url: 'https://api.soundcloud.com/users/?q=%QUERY&format=json&client_id=ddd8d3a316d38bb2e0853693e57781f6',
             wildcard: '%QUERY'
           }
         });
         var searchBar = $(elem).find("[type=text]")[0];
         /*$(searchBar).typeahead({
           hint: true,
           highlight: true,
           minLength: 1
         },
         {
           name: 'sc-users',
           display: 'username',
           source: SCUsers
         });*/
      }
   }
}]);

app.directive('loadButton', [function(){
   return{
      restrict: 'E',
      templateUrl: 'templates/loading.html',
   }
}]);