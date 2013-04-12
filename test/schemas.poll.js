describe("Poll Schema", function () {
  it("should convert a Date into a time integer", function () {
    var precomputedTime = 1357020000000,
        date = new Date;

    date.setYear(2013);
    date.setMonth(0);
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    Poll.convertDateToTime(date).should.equal(precomputedTime);
  });
});
