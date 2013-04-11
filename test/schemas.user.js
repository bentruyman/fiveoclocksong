describe("User Schema", function () {
  it("should accept a username", function () {
    var ben = new User({ name: "ben", password: "p@55W0rd" });

    ben.name.should.equal("ben");
  });

  describe("Authentication", function () {
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
        correct.should.be.true;
        done();
      });
    });
  });
});
