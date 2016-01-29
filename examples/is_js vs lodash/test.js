var mocks = {
  isFactory : function(){
    this.equal = function(str1,str2){
      return (str1 === str2);
    }
  },
  is : function(){
    this.equal = function(var1,var2){
      return var1 === var2;
    }
  },
  lodash : function(){
    this.isEqual = function(var1,var2){
      return var1 === var2;
    }
  }
}

describe('My App',function(){
  describe('Controller',function(){
    var factory = new mocks.isFactory(),
        controller = null;

    beforeEach(function(){
      controller = new Ctrl(factory);
    })

    it('should validate if the strings are different',function(){
      expect(controller.one).toEqual('One');
      expect(controller.two).toEqual('Two');
      controller.validateStr();
      expect(controller.areTheyEqual).toBeFalsy();
    });

    it('should validate if the strings are equal',function(){
      controller.two = 'One';
      expect(controller.one).toEqual('One');
      expect(controller.two).toEqual('One');
      controller.validateStr();
      expect(controller.areTheyEqual).toBeTruthy();
    });
  });
  
  describe('Factory is_js',function(){
    var _is = null,
        factory = null;
    
    beforeEach(function(){
      _is = is;
      is = new mocks.is();
      factory = isLibrary();
    });
    
    afterEach(function(){
      is = _is;
      _is = null;
    });
    
    it('should verify the equality of 2 numbers',function(){
      expect(factory.equal(2,2)).toBeTruthy();
      expect(factory.equal(2,3)).toBeFalsy();
    });
  });

  describe('Factory lodash',function(){
    var __ = null,
        factory = null;
    
    beforeEach(function(){
      __ = _;
      _ = new mocks.lodash();
      factory = isLodash();
    });
    
    afterEach(function(){
      _ = __;
      __ = null;
    });
    
    it('should verify the equality of 2 numbers',function(){
      expect(factory.equal(2,2)).toBeTruthy();
      expect(factory.equal(2,3)).toBeFalsy();
    });
  });
});