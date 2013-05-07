var should = require("should"),
    sinon = require("sinon");

var faye = require("faye"),
    fayeRedis = require("faye-redis");

var config = require("../config"),
    Configurable = require("../app/utils/configurable"),
    Master = require("../app/servers/master");

describe("Master", function () {
  it("should be configurable", function () {
    var master = new Master;
    (master instanceof Configurable).should.be.true;
  });

  describe("Messaging", function () {
    it("should publish a message when a poll starts", function (done) {
      var client = new faye.Client("http://localhost:" + config.messenger.port + config.messenger.port),
          master = new Master(),
          now = (new Date).getTime(),
          spy = sinon.spy();

      master.set("currentPollBoundaries", { start: now + 500, end: now + 1500 });

      client.subscribe("/poll/start", spy);

      setTimeout(function () {
        spy.called.should.equal.true;
        done();
      }, 1000);
    });

    it("should publish a message when a poll stops", function (done) {
      var client = new faye.Client("http://localhost:" + config.messenger.port + config.messenger.port),
          master = new Master(),
          now = (new Date).getTime(),
          spy = sinon.spy();

      master.set("currentPollBoundaries", { start: now, end: now + 500 });

      client.subscribe("/poll/end", spy);

      setTimeout(function () {
        spy.called.should.equal.true;
        done();
      }, 1000);
    });
  });
});
