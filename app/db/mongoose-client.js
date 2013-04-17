var Mongoose = require("mongoose").Mongoose,
    config = require("../../config");

var MongooseClient = module.exports = function MongooseClient(host, port, database) {
  var conf = config.mongodb,
      mongoose = new Mongoose;

  host = host || conf.host;
  port = port || conf.port;
  database = database || conf.database;

  return mongoose.connect("mongodb://" + host + ":" + port + "/" + database);
};
