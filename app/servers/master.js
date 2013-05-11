var http = require("http");

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

// public interface
var Master = module.exports = function (options) {
  var self = this,
      bayeux;

  // set initial configuration
  self.set("pollStartTime", config.app.poll.start);
  self.set("pollEndTime", config.app.poll.end);

  // extend configuration options
  if (options) {
    Object.keys(options).forEach(function (key) {
      self.set(key, options[key]);
    });
  }

  // set initial instance property values
  this.currentPoll = null;
  this.pollTimer = null;

  bayeux = new faye.NodeAdapter({
    mount: "/" + config.messenger.mount,
    timeout: 45,
    engine: {
      type: fayeRedis,
      host: config.redis.host,
      port: config.redis.port,
      database: config.redis.database
    }
  });
  this.messengerServer = http.createServer();
  this.messengerClient = new faye.Client("http://localhost:" + config.messenger.port + "/" + config.messenger.mount);

  bayeux.attach(this.messengerServer);
};

Master.prototype = new Configurable;

Master.prototype.start = function () {
  var currentPoll = this.currentPoll;

  // start new poll timer
  this.pollTimer = new PollTimer(currentPoll.startTime, currentPoll.endTime);
  this.pollTimer.on("start", this._handlePollStart.bind(this));
  this.pollTimer.on("stop",  this._handlePollStop.bind(this));
  this.pollTimer.start();

  // start the messenger server
  this.messengerServer.listen(config.messenger.port);
};

Master.prototype.stop = function () {
  // stop the messenger server
  this.messengerServer.close();
};

// private interface

Master.prototype._handlePollStart = function () {
  this.messengerClient.publish("/poll/start", "started");
};

Master.prototype._handlePollStop = function () {
  this.messengerClient.publish("/poll/stop", "stopped");
};

