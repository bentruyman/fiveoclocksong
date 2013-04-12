var Schema = require("mongoose").Schema;

module.exports = function (mongoose) {
  return mongoose.model("Poll", PollSchema);
};

var PollSchema = exports.Schema = new Schema({
  date:      { type: String, required: true, index: true },
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

PollSchema.statics.convertDateToTime = convertDateToTime;

function convertDateToTime(date) {
  if (date instanceof Date) {
    return date.getTime();
  }

  return date;
}
