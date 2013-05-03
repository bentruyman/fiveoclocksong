var should = require("should"),
    sinon = require("sinon");

var config = require("../config"),
    MongooseClient = require("../app-cov/db/mongoose-client"),
    mongoose = new MongooseClient(config.mongodb.host, config.mongodb.port, config.mongodb.database),
    User = require("../app-cov/models/user")(mongoose);

describe("User Schema", function () {
  beforeEach(function (done) {
    User.remove(function (err) {
      done();
    });
  });

  it("should require a username", function (done) {
    var ben = new User();

    ben.save(function (err) {
      should.exist(err.errors.name);
      done();
    });
  });

  it("should require a password", function (done) {
    var ben = new User({ ben: "ben" });

    ben.save(function (err) {
      should.exist(err.errors._password);
      done();
    });
  });

  it("should require a username and password", function (done) {
    var ben = new User({ name: "ben" });

    ben.setPassword("p@55W0rd", function () {
      ben.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
  });

  describe("Authentication", function () {
    it("should correctly verify an incorrect password", function (done) {
      var ben = new User({ name: "ben" });

      ben.setPassword("p@55W0rd", function () {
        ben.verifyCredentials("foobarbaz", function (err, correct) {
          correct.should.be.false;
          done();
        });
      });
    });

    it("should correctly verify a correct password", function (done) {
      var ben = new User({ name: "ben" });

      ben.setPassword("p@55W0rd", function () {
        ben.verifyCredentials("p@55W0rd", function (err, correct) {
          correct.should.be.true;
          done();
        });
      });
    });

    it("should provide an error if a user has no password", function (done) {
      var ben = new User({ name: "ben" });

      ben.verifyCredentials("p@55W0rd", function (err, correct) {
        should.exist(err);
        correct.should.be.false;
        done();
      });
    });
  });
});
