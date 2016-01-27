var mocks = {
  promise : function(err,succRes,failRes){
    this.then = function(succ,fail){
      if(!err) succ(succRes);
      else fail(failRes);
    }
  },
  githubFactory : function(err,succRes,failRes){
    var self = this;
    
    this.userIdPassed = null;
    this.getProfile = function(userId){
      self.userIdPassed = userId;
      return new mocks.promise(err,succRes,failRes);
    }
  },
  http : function(err,succRes,failRes){
    var self = this;
    
    this.urlPassed = null;
    this.get = function(url){
      self.urlPassed = url;
      return new mocks.promise(err,succRes,failRes);
    }
  },
  q : function(){
    this.defer = function(){
      var succRes = null,
          failRes = null;
      return {
        resolve : function(data){
          succRes(data)
        },
        reject : function(error){
          failRes(error)
        },
        promise : {
          then : function(succ,fail){
            succRes = succ;
            failRes = fail;
          }
        }
      }
    }
  },
  jQuery : function(err){
    this.ajax = function(config){
      setTimeout(function(){
        if(!err) config.success({
          name:'test'
        });
        else config.error({});
      },1);
    }
  },
  XMLHttpRequest : function(){
    var self = this;
    
    this.urlPassed = null;
    this.methodPassed = null;
    this.cb = null;
    this.eventNamePassed = null;
    this.status = 0;
    this.responseText = null
    
    this.open = function(method,url){
      self.urlPassed = url;
      self.methodPassed = method;
    };
    
    this.addEventListener = function(eventName,cb){
      self.eventNamePassed = eventName;
      self.cb = cb;
    }
    
    this.send = function(){
      setTimeout(function(){
        self.status = 200;
        self.responseText = '{ "name" : "test" }'
        self.cb();
      },1);
    }
  }
}

describe("Get My Profile App",function(){
  
  //TESTS FOR CONTROLLER
  describe("Controller",function(){
    var controller = null,
      githubFactory = null,
      success = null;
      failure = null;
    
    beforeEach(function(){
      success = {
        data : {
          name : 'test',
          email : 'test@test.com',
          company : 'company',
          avatar_url : 'my_url'
        }
      };
      failure = {
        error : true
      };
      
      githubFactory = new mocks.githubFactory(null,success,failure);
      
      controller = new Ctrl(githubFactory);
    });
    
    it("should set 'brion25' as the default ID",function(){
      expect(controller.githubId).toEqual('brion25');
    });
    
    it("should get my Github Profile",function(){
      expect(controller.getProfile).not.toBeUndefined();
      controller.githubId = 'otherGithub';
      controller.getProfile();
      expect(githubFactory.userIdPassed).toEqual('otherGithub');
      expect(controller.githubName).toEqual(success.data.name);
      expect(controller.githubEmail).toEqual(success.data.email);
      expect(controller.githubCompany).toEqual(success.data.company);
      expect(controller.githubAvatar).toEqual(success.data.avatar_url);
    });
  });
  
  //TESTS FOR THE FACTORY USING $http
  describe("$http Factory",function(){
    var http = null,
        factory = null,
        success = {success : true},
        failure = {success : false};

    it("should return a promise of the AJAX Request",function(){
      http = new mocks.http(null,success,failure);
      factory = githubHttp(URLS,http);
      factory.getProfile('brion25').then(function(response){
        expect(response.success).toBeTruthy();
      });
      expect(http.urlPassed).toEqual(URLS.PROFILE+'brion25');
    });
  });
  
  //TESTS FOR THE FACTORY USING jQuery
  describe('jQuery Factory',function(){
    var _jQuery = null;
    
    beforeEach(function(){
      _jQuery = jQuery;
      jQuery = new mocks.jQuery(null);
      
    });
    
    afterEach(function(){
      jQuery = _jQuery;
      _jQuery = null;
    })
    
    it("should return a promise of the AJAX Request",function(done){
      var factory = githubJquery(URLS,new mocks.q());
      
      factory.getProfile('brion25').then(function(success){
        expect(success.data).not.toBeUndefined();
        expect(success.data.name).not.toBeUndefined();
        done();
      });
    });

  });
  
  describe('XMLHttpRequest Factory',function(){
    var _XMLHttpRequest = null;
    
    beforeEach(function(){
      _XMLHttpRequest = XMLHttpRequest;
      XMLHttpRequest = mocks.XMLHttpRequest;
      
    });
    
    afterEach(function(){
      XMLHttpRequest = _XMLHttpRequest;
      _XMLHttpRequest = null;
    });
    
    it('should return a promise of the AJAX Request',function(done){
      var factory = githubXMLHttpRequest(URLS,new mocks.q());
      
      factory.getProfile('brion25').then(function(success){
        expect(success.data).not.toBeUndefined();
        expect(success.data.name).not.toBeUndefined();
        done();
      });
    })
  });
  
});