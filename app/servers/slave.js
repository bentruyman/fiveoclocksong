var util = require("util");

var Configurable = require("../utils/configurable");

// public interface
var Slave = module.exports = function (options) {
  Configurable.call(this, options);
};

util.inherits(Slave, Configurable);

