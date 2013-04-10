var Settings = require("settings");

module.exports = new Settings({
  common:      require("./default"),
  development: require("./development"),
  test:        require("./test"),
  production:  require("./production")
});
