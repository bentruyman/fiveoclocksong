var EventEmitter = require("events").EventEmitter,
    util = require("util");

var Configurable = module.exports = function (defaults) {
  var key;

  EventEmitter.call(this);

  this._settings = {};

  if (typeof defaults === "object") {
    for(key in defaults) {
      this.set(key, defaults[key]);
    }
  }
};

util.inherits(Configurable, EventEmitter);

Configurable.prototype.get = function (key) {
  return this._settings[key];
};

Configurable.prototype.set = function (key, value) {
  this._settings[key] = value;
  this.emit("config", key, value);
};

