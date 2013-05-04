var EventEmitter = require("events").EventEmitter;

var Configurable = module.exports = function (defaults) {
  var key;

  this._settings = {};

  if (typeof defaults === "object") {
    for(key in defaults) {
      this.set(key, defaults[key]);
    }
  }
};

Configurable.prototype = new EventEmitter;

Configurable.prototype.get = function (key) {
  return this._settings[key];
};

Configurable.prototype.set = function (key, value) {
  this._settings[key] = value;
  this.emit("config", key, value);
};

