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

var Configurable = require("../utils/configurable"),
    Poll = require("../models/poll")(mongoose, redis, trackService);

var Master = module.exports = function (options) {

};

Master.prototype = new Configurable;

var messengerServer = new faye.NodeAdapter({
      mount: config.messenger.mount,
      engine: {
        type: fayeRedis,
        host: config.redis.host,
        port: config.redis.port
      }
    }),
    messengerClient = messengerServer.getClient();

var currentPoll,
    pollTimer;

function getOrCreatePoll(date, hollaback) {
  var dateString = Poll.createStringFromDate(date);

  Poll.findOne({ date: dateString }, function (err, poll) {
    if (err) {
      hollaback(err);
    } else if (poll !== null) {
      hollaback(null, poll);
    } else {
      trackService.getRandomTracks(config.spotify.playlistId, config.app.tracksPerPoll, function (err, tracks) {
        var poll;

        if (err) {
          hollaback(err);
        } else {
          poll = new Poll({
            date: dateString,
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
  });
}

function handlePollStart() {
  messengerClient.publish("/poll/start", true);
}

function handlePollStop() {
  var tomorrow = new Date;
  tomorrow.setDate(tomorrow.getDate() + 1);

  messengerClient.publish("/poll/stop", true);

  getOrCreatePoll(tomorrow, function (err, poll) {
    if (err) { throw err; }

    updateCurrentPoll(poll);
  });
}

function updateCurrentPoll(poll) {
  // stop any existing poll timer
  if (pollTimer) {
    pollTimer.stop();
  }

  // update state
  currentPoll = poll;
  pollTimer = new PollTimer(poll.startTime, poll.endTime);

  // setup event handlers
  pollTimer.on("start", handlePollStart);
  pollTimer.on("stop",  handlePollStop);

  // start timer
  pollTimer.start();
}

// begin the madness
trackService.open(function (err) {
  if (err) { throw err; }

  getOrCreatePoll(new Date, function (err, poll) {
    var tomorrow;

    if (err) { throw err; }

    // if poll has already ended, create tomorrow's
    if ((new Date).getTime() >= poll.endTime) {
      tomorrow = new Date;
      tomorrow.setDate(tomorrow.getDate() + 1);

      getOrCreatePoll(tomorrow, function (err, poll) {
        if (err) { throw err; }
        updateCurrentPoll(poll);
      });
    }
    // otherwise use today's poll as the current one
    else {
      updateCurrentPoll(poll);
    }
  });
});

// start the messenger server
messengerServer.listen(config.messenger.port);
