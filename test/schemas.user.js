var bcrypt = require("bcrypt"),
    User = require("../app/schemas/user");

describe("User Schema", function () {
  it("should securely encrypt a user's password");

  it("should correctly verify an incorrect password", function (done) {
    var ben = new User({ name: "ben", password: "p@55W0rd" });

    ben.verifyCredentials("foobarbaz", function (correct) {
      correct.should.be.false;
      done();
    });
  });

  it("should correctly verify a correct password", function (done) {
    var ben = new User({ name: "ben", password: "p@55W0rd" });

    ben.verifyCredentials("p@55W0rd", function (correct) {
      correct.should.be.false;
      done();
    });
  });
});
