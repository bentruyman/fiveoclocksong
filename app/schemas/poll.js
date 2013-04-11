var Schema = require("mongoose").Schema;

var PollSchema = module.exports = new Schema({
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
