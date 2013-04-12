var events = require("events"),
    util = require("util");

const ACTIVE = "active";
const INACTIVE = "inactive";

var PollTimer = module.exports = function (start, end) {
  events.EventEmitter.call(this);
};

util.inherits(PollTimer, events.EventEmitter);

PollTimer.prototype.getState = function () {
  return this._currentState;
};

PollTimer.prototype.start = function () {
  PollTimer = setInterval(this.tick.bind(this), config.timer.interval);
};

PollTimer.prototype.stop = function () {
  if (typeof PollTimer !== "undefined") {
    clearInterval(this._timer);
  }
};

PollTimer.prototype.tick = function () {};

PollTimer.STARTED = ACTIVE;
PollTimer.STOPPED = INACTIVE;
