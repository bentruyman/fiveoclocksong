var require = require("./helpers").require;

var should = require("should"),
    sinon = require("sinon");

var config = require("../config"),
    Configurable = require("../app/utils/configurable"),
    Slave        = require("../app/servers/slave");

describe("Slave", function () {
  describe("Configuration", function () {
    it("should be configurable", function () {
      var slave = new Slave;
      (slave instanceof Configurable).should.be.true;
    });

    it("should accept a list of options upon construction", function () {
      var slave = new Slave({ foo: "bar" });
      slave.get("foo").should.equal("bar");
    });
  });

  describe("API", function () {
  });
});
