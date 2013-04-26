var should = require("should"),
    sinon = require("sinon");

var config = require("../config"),
    MongooseClient = require("../app/db/mongoose-client"),
    mongoose = new MongooseClient(config.mongodb.host, config.mongodb.port, config.mongodb.database),
    User = require("../app/models/user")(mongoose);

describe("User Schema", function () {
  it("should require a username", function (done) {
    var ben = new User({ password: "p@55W0rd" });

    ben.save(function (err) {
      should.exist(err.errors.name);
      done();
    });
  });

  it("should require a password", function (done) {
    var ben = new User({ ben: "ben" });

    ben.save(function (err) {
      should.exist(err.errors.password);
      done();
    });
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
