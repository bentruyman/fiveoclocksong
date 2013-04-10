var events = require("events"),
    util = require("util");

const ACTIVE = "active";
const INACTIVE = "inactive";

module.exports = function (config) {
  var currentState = INACTIVE,
      timer;

  var PollRunner = function () {
    events.EventEmitter.call(this);
  };

  util.inherits(PollRunner, events.EventEmitter);

  PollRunner.prototype.getState = function () {
    return currentState;
  };

  PollRunner.prototype.start = function () {
    PollRunner = setInterval(this.tick.bind(this), config.timer.interval);
  };

  PollRunner.prototype.stop = function () {
    if (typeof PollRunner !== "undefined") {
      clearInterval(timer);
    }
  };

  PollRunner.prototype.tick = function () {};

  PollRunner.STARTED = ACTIVE;
  PollRunner.STOPPED = INACTIVE;

  return PollRunner;
};
