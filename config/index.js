var fs = require("fs"),
    Settings = require("settings"),
    yaml = require("yaml");

function convertYaml(name) {
  return yaml.eval(fs.readFileSync(__dirname + "/" + name + ".yml").toString());
}

module.exports = new Settings({
  common      : convertYaml("/default"),
  development : convertYaml("/development"),
  test        : convertYaml("/test"),
  production  : convertYaml("/production")
});
