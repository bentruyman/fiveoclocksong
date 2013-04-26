var Schema = require("mongoose").Schema,
    config = require("../../config"),
    pollConfig = config.app.poll;

module.exports = function (mongoose) {
  return mongoose.model("Poll", PollSchema);
};

var PollSchema = exports.Schema = new Schema({
  date:      { type: String, required: true, index: true, set: setDate },
  startTime: { type: Number, required: true },
  endTime:   { type: Number, required: true },
  tracks:    [String]
});

PollSchema.methods.upvote = function (username, trackIndex, hollaback) {};

PollSchema.methods.downvote = function (username, trackIndex, hollaback) {};

PollSchema.methods.getTrackData = function (trackIndex, hollaback) {};

PollSchema.methods.getAllTrackData = function (hollaback) {};

PollSchema.methods.getTrackVotes = function (trackIndex, hollaback) {};

PollSchema.methods.getAllTrackVotes = function (hollaback) {};

PollSchema.statics.createBoundaryTime = createBoundaryTime;
PollSchema.statics.createDateFromString = createDateFromString;
PollSchema.statics.createStringFromDate = createStringFromDate;

function createBoundaryTime(date, hours, minutes) {
  var clone = new Date(date);

  clone.setHours(hours);
  clone.setMinutes(minutes);
  clone.setSeconds(0);
  clone.setMilliseconds(0);

  return clone.getTime();
}

function createDateFromString(str) {
  // FIXME: Will fail in the year 10,000. Must fix!!
  var year  = str.slice(0, 4),
      month = str.slice(4, 6),
      day   = str.slice(6, 8),
      date = new Date;

  date.setFullYear(year);
  date.setMonth(month - 1);
  date.setDate(day);

  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

function createStringFromDate(date) {
  var year  = date.getFullYear(),
      month = pad(date.getMonth() + 1),
      day   = pad(date.getDate());

  return '' + year + month + day;
}

function pad(num) {
  // convert num to a string
  num = "" + num;

  return (num.length === 1) ? "0" + num : num;
}

function setDate(str) {
  var date = createDateFromString(str);

  if (typeof this.startTime === "undefined") {
    this.startTime = createBoundaryTime(date, pollConfig.start.hour, pollConfig.start.minute);
  }

  if (typeof this.endTime === "undefined") {
    this.endTime = createBoundaryTime(date, pollConfig.end.hour, pollConfig.end.minute);
  }

  return str;
}
