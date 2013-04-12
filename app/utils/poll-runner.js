var events = require("events"),
    util = require("util");

const ACTIVE = "active";
const INACTIVE = "inactive";

var PollRunner = module.exports = function (start, end) {
  events.EventEmitter.call(this);
};

util.inherits(PollRunner, events.EventEmitter);

PollRunner.prototype.getState = function () {
  return this._currentState;
};

PollRunner.prototype.start = function () {
  PollRunner = setInterval(this.tick.bind(this), config.timer.interval);
};

PollRunner.prototype.stop = function () {
  if (typeof PollRunner !== "undefined") {
    clearInterval(this._timer);
  }
};

PollRunner.prototype.tick = function () {};

PollRunner.STARTED = ACTIVE;
PollRunner.STOPPED = INACTIVE;
