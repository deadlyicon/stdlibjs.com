describe("DelayedFunctionCall", function(){

  beforeEach(function() {

    jasmine.Clock.installed = jasmine.Clock.defaultFakeTimer;

    this.addMatchers({
      toBeAround: function(value) {
        this.toBeGreaterThan(value-5);
        this.toBeLessThan(value+5);
        return true;
      }
    });
  });

  describe("#elapsed, #eta", function() {

    it("should return the number of millieconds since the DelayedFunctionCall was created", function(){

      var princessCaptured = false, dfc;
      function capturePrincess() {
        princessCaptured = true;
      };

      console.log('setTimeout', setTimeout);

      waits(1);

      runs(function() {
        dfc = new DelayedFunctionCall(capturePrincess, 0.1)
        expect(dfc.start).toBeAround(Date.now());
        expect(dfc.elapsed()).toBeAround(0);
        expect(dfc.eta()    ).toBeAround(100);
      });

      waits(50);

      runs(function(){
        expect(princessCaptured).toBe(false);
        expect(dfc.elapsed()).toBeAround(50);
        expect(dfc.eta()    ).toBeAround(50);
      });

      waits(50);

      runs(function(){
        expect(dfc.elapsed()).toBeAround(100);
        expect(dfc.eta()    ).toBeAround(0);
      });

      waits(50);

      runs(function(){
        expect(princessCaptured).toBe(true);
        expect(dfc.elapsed()).toBeAround(100);
        expect(dfc.eta()    ).toBeAround(0);
      });

    });

  });

  it("should not call the given function when prevent is called", function(){

    var princessCaptured = false, dfc;
    function capturePrincess() {
      princessCaptured = true;
    };

    runs(function() {

      dfc = new DelayedFunctionCall(capturePrincess, 0.05)
      expect(princessCaptured).toBe(false);
      expect(dfc.called      ).toBe(false);
      expect(dfc.prevented   ).toBe(false);
    });

    waits(10);

    runs(function(){
      expect(princessCaptured).toBe(false);
      expect(dfc.called      ).toBe(false);
      expect(dfc.prevented   ).toBe(false);

      dfc.prevent();

      expect(princessCaptured).toBe(false);
      expect(dfc.called      ).toBe(false);
      expect(dfc.prevented   ).toBeTruthy();
    });

    waits(40);

    runs(function(){
      expect(princessCaptured).toBe(false);
      expect(dfc.called      ).toBe(false);
      expect(dfc.prevented   ).toBeTruthy();
    });

  });

  it("should not call the given function when call is called early", function(){

    var princessCaptured = 0, dfc;
    function capturePrincess() {
      princessCaptured++;
    };

    runs(function() {
      dfc = new DelayedFunctionCall(capturePrincess, 0.05)
      expect(princessCaptured).toBe(0);
      expect(dfc.called      ).toBe(false);
      expect(dfc.prevented   ).toBe(false);
    });

    waits(10);

    runs(function(){
      expect(princessCaptured).toBe(0);
      expect(dfc.called      ).toBe(false);
      expect(dfc.prevented   ).toBe(false);

      dfc.call();

      expect(princessCaptured).toBe(1);
      expect(dfc.called      ).toBeTruthy();
      expect(dfc.prevented   ).toBe(false);
      expect(dfc.eta()       ).toBe(null);

    });

    waits(40);

    runs(function(){
      expect(princessCaptured).toBe(1);
      expect(dfc.called      ).toBeTruthy();
      expect(dfc.prevented   ).toBe(false);
      expect(dfc.eta()       ).toBe(null);
    });

  });

});
