var faye = require("faye"),
    fayeRedis = require("faye-redis");

var config = require("../../config"),
    MongooseClient = require("../db/mongoose-client"),
    RedisClient = require("../db/redis-client"),
    TrackService = require("../services/track"),
    PollTimer = require("../utils/poll-timer");

var mongoose = new MongooseClient(config.mongodb.host, config.mongodb.port, config.mongodb.database),
    redis = new RedisClient(config.redis.host, config.redis.port, config.redis.database),
    trackService = new TrackService(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PASSWORD);

var Poll = require("../models/poll")(mongoose, redis, trackService);

function createTodaysPoll(hollaback) {
  trackService.getRandomTracks(config.app.tracksPerPoll, function (err, tracks) {
    var poll;

    if (err) {
      hollaback(err);
    } else {
      poll = new Poll({
        date: new Date,
        tracks: tracks
      });

      poll.save(function (err) {
        if (err) {
          hollaback(err);
        } else {
          hollaback(null, poll);
        }
      });
    }
  });
}

function getTodaysPoll(hollaback) {
  Poll.find({ date: Poll.createStringFromDate(new Date) }, hollaback);
}
