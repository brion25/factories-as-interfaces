angular.module('myApp',[])
  .factory('isFactory',isLibrary)
  //.factory('isFactory',isLodash)
  .controller('myCtrl',Ctrl);

Ctrl.$inject = ['isFactory'];
function Ctrl(is){
  var vm = this;
  
  vm.one='One';
  vm.two='Two';
  vm.areTheyEqual = undefined
  
  vm.validateStr = function(){
    vm.areTheyEqual = is.equal(vm.one,vm.two);
  }
}

function isLibrary(){
  return {
    equal : is.equal
  }
}

function isLodash(){
  return {
    equal : _.isEqual
  }
}