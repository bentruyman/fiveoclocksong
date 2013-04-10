var PollRunner = require("../app/utils/poll-runner").PollRunner;

describe("Poll Runner", function () {
  it("should be inactive before the poll has started");
  it("should be active after the poll has started");
  it("should notify event listeners when a poll has started");
  it("should notify event listeners when a poll has stopped");
  it("should skip days not in the poll runner's active days list");
});
