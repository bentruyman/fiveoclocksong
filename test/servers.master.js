var should = require("should"),
    sinon = require("sinon");

var faye = require("faye"),
    fayeRedis = require("faye-redis");

var config = require("../config"),
    MongooseClient = require("../app-cov/db/mongoose-client"),
    RedisClient    = require("../app-cov/db/redis-client"),
    TrackService   = require("../app-cov/services/track"),
    mongoose = new MongooseClient(config.mongodb.host, config.mongodb.port, config.mongodb.database),
    redis = new RedisClient(config.redis.host, config.redis.port, config.redis.database),
    trackService = new TrackService(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PASSWORD),
    Configurable = require("../app-cov/utils/configurable"),
    Master       = require("../app-cov/servers/master"),
    Poll         = require("../app-cov/models/poll")(mongoose, redis, trackService);

describe("Master", function () {
  describe("Configuration", function () {
    it("should be configurable", function () {
      var master = new Master;
      (master instanceof Configurable).should.be.true;
    });

    it("should accept a list of options upon construction", function () {
      var master = new Master({ foo: "bar" });
      master.get("foo").should.equal("bar");
    });
  });

  describe("Messaging", function () {
    this.timeout(10000);

    it("should publish a message when a poll starts", function (done) {
      var client = new faye.Client("http://localhost:" + config.messenger.port + "/" + config.messenger.mount),
          master = new Master,
          today = new Date,
          now = today.getTime(),
          spy = sinon.spy();

      master.currentPoll = new Poll({
        date: today,
        startTime: now + 500,
        endTime: now + 1000
      });

      client.subscribe("/poll/start", spy);

      master.start();

      setTimeout(function () {
        spy.called.should.be.true;
        master.stop();
        done();
      }, 1000);
    });

    it("should publish a message when a poll stops", function (done) {
      var client = new faye.Client("http://localhost:" + config.messenger.port + "/" + config.messenger.mount),
          master = new Master,
          today = new Date,
          now = today.getTime(),
          spy = sinon.spy();

      master.currentPoll = new Poll({
        date: today,
        startTime: now - 500,
        endTime: now + 500
      });

      client.subscribe("/poll/stop", spy);

      master.start();

      setTimeout(function () {
        spy.called.should.be.true;
        master.stop();
        done();
      }, 1500);
    });
  });
});
