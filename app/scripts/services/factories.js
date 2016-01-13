"use strict";
(function(){
   var app = angular.module("sineApp");
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
})();