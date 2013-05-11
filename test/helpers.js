var path = require("path");

var APP = "app",
    COV = APP + "-cov",
    ROOT = path.join(__dirname, "../"),
    APP_DIR = path.join(ROOT, APP),
    COV_DIR = path.join(ROOT, COV);

module.exports = {
  require: function (id) {
    if (process.env.NODE_ENV !== "development") { return require(id); }

    var relativePath = require.resolve(id).split(ROOT)[1],
        split = relativePath.split(path.sep);

    if (split[1]) {
      if (split[0] === APP) {
        split[0] = COV;
      }
      return require(ROOT + split.join(path.sep));
    } else {
      return require(id);
    }
  }
};

