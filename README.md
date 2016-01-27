# Factories as Interfaces - AngularJS

![Kyubi sharing chakra](https://raw.github.com/brion25/factories-as-interfaces/master/assets/chakra.png)

Let's imagine you want o use the library: [`is`](https://arasatasaygin.github.io/is.js/) in an Angular Application, you can say, "hey! I just need to load it before my angular App"
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/is_js/0.8.0/is.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.9/angular.js"></script>
<script>
    angular.module('myApp',[])
        .controller('myCtrl',function(){
            var vm = this;
            if(is.equal(vm.var1,vm.var2)) console.log('Yup!');
        });
</script>
```
It's valid, but not the correct approach, what happened if you want to bind the result? then you will need to use `$scope.$digest();` that's not good, because you are interrumping the digest cycle of angular, so, what should we do? wrap the entire library in a factory!

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/is_js/0.8.0/is.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.9/angular.js"></script>
<script>
    angular.module('myApp',[])
        .factory('isFactory',function(){
            return {
                equal : is.equal
            };
        })
        .controller('myCtrl',['isFactory',function(is){
            var vm = this;
            if(is.equal(vm.var1,vm.var2)) console.log('Yup!');
        }]);
</script>
```
## How does it work?

 Basically the factory returns the instance of `is`, but now the difference is that Angular is wrapping the instance and now the bindings work! without any `$scope.$digest();`.

## Are there any advantages?

Of course there're advantages:

- **Unit Testing** - Unit testing is easier, because now we can mock that factory and perform unit testing as it is, testing in isolation, without hard dependencies
- **Bindings** - Now Angular knows your external library exists, so it will manage the bindings as it normally does, without any `$scope.$digest()`
- **Dependency almost erased** - I said almost, because still we're depending on the library of `is.js`, but now we can change the library any time we want, because we have the interface ready,ex:
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.0.1/lodash.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.9/angular.js"></script>
<script>
    angular.module('myApp',[])
        .factory('isFactory',function(){
            return {
                equal : _.isEqual
            };
        })
        .controller('myCtrl',['isFactory',function(is){
            var vm = this;
            if(is.equal(vm.var1,vm.var2)) console.log('Yup!');
        }]);
</script>
```
  As you might see, I changed `is` for `lodash` I just change the Factory, there's no need to change the controller, because the **Factory** is working as **an interface** between the controller.
