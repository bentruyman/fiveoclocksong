var should = require("should"),
    sinon = require("sinon");

var Configurable = require("../app/utils/configurable");

describe("Configurable", function () {
  describe("Events", function () {
    it("should emit an event when a configuration setting changes", function () {
      var configurable = new Configurable(),
          spy = sinon.spy();

      configurable.on("config", spy);
      configurable.set("foo", "bar");

      spy.called.should.be.true;
    });
  });

  describe("Settings", function () {
    it("should set and get a setting", function () {
      var configurable = new Configurable();

      configurable.set("foo", "bar");
      configurable.get("foo").should.equal("bar");
    });

    it("should accept a set of defaults", function () {
      var configurable = new Configurable({ foo: "bar" });

      configurable.get("foo").should.equal("bar");
    });
  });
});
