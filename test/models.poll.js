var should = require("should"),
    sinon = require("sinon");

var config = require("../config"),
    MongooseClient = require("../app/db/mongoose-client"),
    RedisClient = require("../app/db/redis-client"),
    mongoose = new MongooseClient(config.mongodb.host, config.mongodb.port, config.mongodb.database),
    redis = new RedisClient(config.redis.host, config.redis.port, config.redis.database),
    Poll = require("../app/models/poll")(mongoose);

describe("Poll Schema", function () {
  beforeEach(function (done) {
    Poll.remove(function (err) {
      done();
    });
  });

  it("should convert a Date into date string", function () {
    var dateString = "20130101",
        date = new Date;

    date.setYear(2013);
    date.setMonth(0);
    date.setDate(1);

    Poll.createStringFromDate(date).should.equal(dateString);
  });

  it("should convert a date string into a Date", function () {
    var dateString = "20130101",
        date = new Date;

    date.setYear(2013);
    date.setMonth(0);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    Poll.createDateFromString(dateString).getTime().should.equal(date.getTime());
  });

  it("should require a date", function (done) {
    var poll = new Poll();

    poll.save(function (err) {
      should.exist(err.errors.date);
      done();
    });
  });

  it("should require a start time", function (done) {
    var poll = new Poll();

    poll.save(function (err) {
      should.exist(err.errors.startTime);
      done();
    });
  });

  it("should require an end time", function (done) {
    var poll = new Poll();

    poll.save(function (err) {
      should.exist(err.errors.endTime);
      done();
    });
  });

  it("should automatically populate start and end times based on config values when a date is provided", function (done) {
    var poll = new Poll({ date: '20130101' });

    poll.save(function (err) {
      should.not.exist(err);
      done();
    });
  });

  it("should not overwrite start and end times when a date is provided", function () {
    var startTime = 1357023600000,
        endTime   = 1357102800000,
        poll = new Poll({
          date: new Date("01/01/2013"),
          startTime: startTime,
          endTime: endTime
        });

    poll.startTime.should.equal(startTime);
    poll.endTime.should.equal(endTime);
  });

  describe("Tracks", function () {

  });

  describe("Voting", function () {
    it("should allow for upvotes", function () {

    });

    it("should allow for downvotes", function () {

    });
  });
});
