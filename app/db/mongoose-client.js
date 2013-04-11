var Mongoose = require("mongoose").Mongoose;

var exports = module.exports = {};

var MongooseClient = module.exports = function MongooseClient(host, port, db) {
  var mongoose = new Mongoose;

  return mongoose.connect("mongodb://" + host + ":" + port + "/" + db);
};
