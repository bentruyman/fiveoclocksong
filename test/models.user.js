var config = require("../config"),
    MongooseClient = require("../app/db/mongoose-client"),
    mongoose = new MongooseClient(config.mongodb.host, config.mongodb.port, config.mongodb.database),
    User = require("../app/models/user")(mongoose);

describe("User Schema", function () {
  it("should accept a username", function () {
    var ben = new User({ name: "ben", password: "p@55W0rd" });

    ben.name.should.equal("ben");
  });

  describe("Authentication", function () {
    it("should correctly verify an incorrect password", function (done) {
      var ben = new User({ name: "ben", password: "p@55W0rd" });

      ben.verifyCredentials("foobarbaz", function (err, correct) {
        correct.should.be.false;
        done();
      });
    });

    it("should correctly verify a correct password", function (done) {
      var ben = new User({ name: "ben", password: "p@55W0rd" });

      ben.verifyCredentials("p@55W0rd", function (err, correct) {
        correct.should.be.true;
        done();
      });
    });
  });
});
