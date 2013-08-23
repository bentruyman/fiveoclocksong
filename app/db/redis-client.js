var redis = require("redis"),
    config = require("../../config");

var RedisClient = module.exports = function RedisClient(host, port, database) {
  var client,
      conf = config.redis;

  host = host || conf.host;
  port = port || conf.port;
  database = database || conf.database;

  client = redis.createClient(port, host);

  client.select(database);

  return client;
};
