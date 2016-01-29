var URLS = {
  PROFILE : 'https://api.github.com/users/'
}

angular.module('myApp',[])
  .constant('URLS',URLS)
  //.factory('github',githubHttp)
  //.factory('github',githubJquery)
  .factory('github',githubXMLHttpRequest)
  .controller('myCtrl',Ctrl);

function Ctrl(github){
  var vm = this;
  
  vm.working=false;
  vm.githubId="brion25";
  vm.getProfile = function(){
    vm.working = true;
    github.getProfile(vm.githubId).then(function(response){
      vm.working=false;
      vm.githubName = response.data.name;
      vm.githubEmail = response.data.email;
      vm.githubCompany = response.data.company;
      vm.githubAvatar = response.data.avatar_url;
    },function(error){
      vm.working = false;
      console.error(error);
    });
  }
}

function githubHttp(URLS,$http){
  return {
    getProfile : function(userId){
      return $http.get(URLS.PROFILE + userId);
    }
  }
}

function githubJquery(URLS,$q){
  return {
    getProfile : function(userId){
      var defer = $q.defer();
      jQuery.ajax({
        method : 'GET',
        url:URLS.PROFILE + userId,
        success : function(response){
          var data = {
            data : response
          }
          defer.resolve(data);
        },
        error:function(error){
          defer.reject(error);
        }
      });
      
      return defer.promise;
    }
  }
}

function githubXMLHttpRequest(URLS, $q){
  return {
    getProfile : function(userId){
      var defer = $q.defer(),
          request = new XMLHttpRequest();
      
      request.open('GET',URLS.PROFILE + userId);
      request.addEventListener('load',function(){
        if(request.status >= 200 && request.status < 400){
          var data = {
            data : JSON.parse(request.responseText)
          }
          defer.resolve(data);
        }else if(request.status >= 400){
          defer.reject(JSON.parse(request.responseText));
        }
      });
      request.send();
      return defer.promise;
    }
  }
}