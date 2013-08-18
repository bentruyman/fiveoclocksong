var fs = require("fs"),
    Settings = require("settings"),
    yaml = require("yaml");

console.log(__dirname);
module.exports = new Settings({
  common      : yaml.eval(fs.readFileSync(__dirname + "/default.yml").toString()),
  development : yaml.eval(fs.readFileSync(__dirname + "/development.yml").toString()),
  test        : yaml.eval(fs.readFileSync(__dirname + "/test.yml").toString()),
  production  : yaml.eval(fs.readFileSync(__dirname + "/production.yml").toString())
});
