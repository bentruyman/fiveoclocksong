var path = require("path");

var winston = require("winston");

const ROOT = path.join(__dirname, "../../");
const LEVELS = {
  development: "debug",
  test: "debug",
  production: "info"
};
const LOG = path.join(ROOT, "logs");

module.exports = {
  getLogger: function (label) {
    var env = process.env.NODE_ENV || "development",
        transports = [];

    label = label || "default";

    if (env === "development") {
      transports.push(new (winston.transports.Console)({
        colorize: true,
        label: label,
        level: LEVELS.development,
        timestamp: true
      }));
    }

    transports.push(new (winston.transports.File)({
      filename: path.join(LOG, env + ".log"),
      label: label,
      level: LEVELS[env] || LEVELS.development,
      prettyPrint: true
    }));

    return new (winston.Logger)({
      transports: transports
    });
  }
};

