var events = require("events"),
    util = require("util"),
    config = require("../../config");

const ACTIVE = "active";
const INACTIVE = "inactive";
const START = "start";
const STOP = "stop";
const INTERVAL = config.app.timer.interval;

var PollTimer = module.exports = function (start, end) {
  if (!start || !end) { throw "Both start and end times must be specified"; }
  if (start > end) { throw "Start time must be less than end time"; }

  this.startTime = start;
  this.endTime = end;

  this._previousState = this.getCurrentState();
  this._timer = null;

  events.EventEmitter.call(this);
};

util.inherits(PollTimer, events.EventEmitter);

PollTimer.prototype.getCurrentState = function () {
  var now = Date.now();

  return (now >= this.startTime && now <= this.endTime) ? ACTIVE : INACTIVE;
};

PollTimer.prototype.start = function () {
  if (this._timer !== null) { throw "Timer has already been started"; }
  this._timer = setInterval(this.tick.bind(this), INTERVAL);
};

PollTimer.prototype.stop = function () {
  if (this._timer !== null) {
    clearInterval(this._timer);
    this._timer = null;
  }
};

PollTimer.prototype.tick = function () {
  var currentState = this.getCurrentState(),
      previousState = this._previousState;

  if (previousState === INACTIVE && currentState === ACTIVE) {
    this.emit(START);
  } else if (previousState === ACTIVE && currentState === INACTIVE) {
    this.emit(STOP);
  }

  this._previousState = currentState;
};

PollTimer.ACTIVE = ACTIVE;
PollTimer.INACTIVE = INACTIVE;
