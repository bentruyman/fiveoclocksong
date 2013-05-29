var require = require("./helpers").require;

var should = require("should"),
    sinon = require("sinon");

var faye = require("faye"),
    fayeRedis = require("faye-redis");

var config = require("../config"),
    MongooseClient = require("../app/db/mongoose-client"),
    RedisClient    = require("../app/db/redis-client"),
    TrackService   = require("../app/services/track"),
    mongoose = new MongooseClient(config.mongodb.host, config.mongodb.port, config.mongodb.database),
    redis = new RedisClient(config.redis.host, config.redis.port, config.redis.database),
    trackService = new TrackService(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PASSWORD),
    Configurable = require("../app/utils/configurable"),
    Master       = require("../app/servers/master"),
    Poll         = require("../app/models/poll")(mongoose, redis, trackService);

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

    it("should set a default poll start and end time based on configuration options", function () {
      var master = new Master;

      master.get("pollStartTime").should.equal(config.app.poll.start);
      master.get("pollEndTime").should.equal(config.app.poll.end);
    });

    it("should accept poll start and end times that override the default configuration options", function () {
      var start = { hour: 2, minute: 30 },
          end   = { hour: 9, minute: 30 },
          master = new Master({
            pollStartTime: start,
            pollEndTime: end
          });

      master.get("pollStartTime").should.eql(start);
      master.get("pollEndTime").should.eql(end);
    });
  });

  describe("Messaging", function () {
    this.timeout(3000);

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
