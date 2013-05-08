var should = require("should"),
    sinon = require("sinon");

var config = require("../config"),
    MongooseClient = require("../app-cov/db/mongoose-client"),
    RedisClient    = require("../app-cov/db/redis-client"),
    TrackService   = require("../app-cov/services/track"),
    mongoose = new MongooseClient(config.mongodb.host, config.mongodb.port, config.mongodb.database),
    redis = new RedisClient(config.redis.host, config.redis.port, config.redis.database),
    trackService = new TrackService(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PASSWORD),
    Poll = require("../app-cov/models/poll")(mongoose, redis, trackService);

describe("Poll Schema", function () {
  this.timeout(4000);

  before(function (done) {
    trackService.open(done);
  });

  beforeEach(function (done) {
    Poll.remove(function () {
      redis.flushall(function () {
        done();
      });
    });
  });

  after(function () {
    trackService.close();
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
    it("should retrieve a track's data", function (done) {
      var poll = new Poll({
        date: new Date,
        tracks: ["spotify:track:0FutrWIUM5Mg3434asiwkp"]
      });

      poll.getTrackData(0, function (err, track) {
        should.not.exist(err);
        track.name.should.equal("Never Gonna Give You Up");
        track.artist.should.equal("Rick Astley");
        done();
      });
    });

    it("should provide an error when requesting the data of a non-existent track", function (done) {
      var poll = new Poll({ date: new Date });

      poll.getTrackData(0, function (err) {
        should.exist(err);
        done();
      });
    });
  });

  describe("Voting", function () {
    describe("Up/Downvotes", function () {
      it("should allow for upvotes", function (done) {
        var poll = new Poll({ date: new Date });

        poll.upvote("ben", 0, function (err) {
          should.not.exist(err);
          done();
        });
      });

      it("should allow for downvotes", function (done) {
        var poll = new Poll({ date: new Date });

        poll.downvote("ben", 0, function (err) {
          should.not.exist(err);
          done();
        });
      });
    });

    describe("Retrieval", function () {
      describe("Single", function () {
        it("should return votes for a single poll's track", function (done) {
          var poll = new Poll({
            date: new Date,
            tracks: ["foo", "bar"]
          });

          poll.upvote("ben", 0, function (err) {
            poll.getTrackVotes(0, function (err, votes) {
              should.not.exist(err);
              votes.ben.should.equal(1);
              done();
            });
          });
        });

        it("should provide an empty object when requesting votes for an unvoted track", function (done) {
          var poll = new Poll({
            date: new Date,
            tracks: ["foo"]
          });

          poll.getTrackVotes(0, function (err, votes) {
            should.not.exist(err);
            votes.should.eql({});
            done();
          });
        });

        it("should provide an error when requesting votes for a non-existent track", function (done) {
          var poll = new Poll({
            date: new Date,
            tracks: ["foo"]
          });

          poll.upvote("ben", 0, function (err) {
            poll.getTrackVotes(1, function (err, votes) {
              should.exist(err);
              done();
            });
          });
        });
      });

      describe("Multiple", function () {
        it("should return votes for all of the poll's tracks", function (done) {
          var poll = new Poll({
            date: new Date,
            tracks: ["foo", "bar"]
          });

          poll.upvote("ben", 0, function (err) {
            poll.upvote("lee", 1, function (err) {
              poll.getAllTrackVotes(function (err, votes) {
                should.not.exist(err);
                votes[0].ben.should.equal(1);
                votes[1].lee.should.equal(1);
                done();
              });
            });
          });
        });

        it("should return an empty array of votes if no tracks exist", function (done) {
          var poll = new Poll({
            date: new Date
          });

          poll.getAllTrackVotes(function (err, votes) {
            should.not.exist(err);
            votes.should.be.empty;
            done();
          });
        });

        it("should return empty objects for all of the poll's unvoted tracks", function (done) {
          var poll = new Poll({
            date: new Date,
            tracks: ["foo", "bar"]
          });

          poll.getAllTrackVotes(function (err, votes) {
            should.not.exist(err);
            votes[0].should.eql({});
            votes[1].should.eql({});
            done();
          });
        });
      });
    });
  });
});
