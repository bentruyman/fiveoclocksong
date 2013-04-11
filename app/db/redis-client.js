var redis = require("redis");

var RedisClient = module.exports = function RedisClient(host, port, db) {
  var conf = config.redis,
      client = redis.createClient(port, host);

  client.select(db);

  return client;
};
