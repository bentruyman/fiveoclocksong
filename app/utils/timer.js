var events = require("events"),
    util = require("util");

const STARTED = "started";
const STOPPED = "stopped";

module.exports = function (config) {
  var currentState = STOPPED,
      timer;
  
  var Timer = function () {
    events.EventEmitter.call(this);
  };
  
  util.inherits(Timer, events.EventEmitter);
  
  Timer.prototype.getState = function () {
    return currentState;
  };
  
  Timer.prototype.start = function () {
    timer = setInterval(this.tick.bind(this), config.timer.interval);
  };
  
  Timer.prototype.stop = function () {
    if (typeof timer !== "undefined") {
      clearInterval(timer);
    }
  };
  
  Timer.prototype.tick = function () {};
  
  Timer.STARTED = STARTED;
  Timer.STOPPED = STOPPED;
  
  return Timer;
};
