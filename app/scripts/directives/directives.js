"use strict";
(function(){
   var app = angular.module("sineApp");
   app.directive('songCard', ['$timeout', '$rootScope', function($timeout, $rootScope) {
      return {
        restrict: 'E',
         transclude: true,
         templateUrl: 'scripts/directives/song-card.html',
         link: function(scope, elem){
            function reColor(){
               //adding random backgrounds
               var artCovers = ['orange','red','blue','green','yellow'];
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
            //update background color when order changes
            scope.$watch('orderedSongs', function(oldVal, newVal){
               reColor();
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
                  var newPos = Math.floor(($rootScope.trackPos / 300) * $rootScope.currentTrack.duration);
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
         templateUrl: 'scripts/directives/user-search.html',
         link: function(scope, elem){
            /*var substringMatcher = function(strs) {
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
            $(searchBar).typeahead({
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
         templateUrl: 'scripts/directives/loading.html',
      }
   }]);
})();