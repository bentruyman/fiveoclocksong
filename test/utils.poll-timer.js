var sinon = require("sinon"),
    PollTimer = require("../app/utils/poll-timer");

describe("Poll Timer", function () {
  describe("Constructor", function () {
    it("should throw if the start time is later than the end time", function () {
      var now = Date.now(),
          earlier = now - 100,
          threw = false;

      try { new PollTimer(now, earlier); } catch (e) { threw = true; }

      threw.should.be.true;
    });

    it("should throw if no start or end time is specified", function () {
      var throwCount = 0;

      try { new PollTimer(Date.now()); } catch (e) { throwCount++; }
      try { new PollTimer(null, Date.now()); } catch (e) { throwCount++; }
      try { new PollTimer(); } catch (e) { throwCount++; }

      throwCount.should.equal(3);
    });
  });

  describe("Events", function () {
    it("should notify event listeners when the timer has started", function (done) {
      var later = Date.now() + 100,
          littleLater = later + 2000;

      var timer = new PollTimer(later, littleLater);

      timer.on("start", done);

      timer.start();
    });

    it("should notify event listeners when the timer has stopped", function (done) {
      var now = Date.now(),
          later = now + 100;

      var timer = new PollTimer(now, later);

      timer.on("stop", done);

      timer.start();
    });
  });

  describe("State", function () {
    it("should be inactive before the timer has started", function () {
      var later = Date.now() + 100,
          littleLater = later + 100;

      var timer = new PollTimer(later, littleLater);

      timer.getCurrentState().should.equal(PollTimer.INACTIVE);
    });

    it("should be active after the timer has started", function () {
      var earlier = Date.now() - 100,
          later = earlier + 200;

      var timer = new PollTimer(earlier, later);

      timer.getCurrentState().should.equal(PollTimer.ACTIVE);
    });

    it("should throw when asked to start if it's already been started", function () {
      var now = Date.now(),
          later = now + 100,
          threw = false;

      var timer = new PollTimer(now, later);

      timer.start();

      try { timer.start(); } catch (e) { threw = true; }

      threw.should.be.true;
    });
  });
});
