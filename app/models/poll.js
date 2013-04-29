var Schema = require("mongoose").Schema,
    Q = require("q"),
    config = require("../../config"),
    pollConfig = config.app.poll;

module.exports = function (mongoose, redis, trackService) {
  var PollSchema = exports.Schema = new Schema({
    date:      { type: String, required: true, index: true, set: setDate },
    startTime: { type: Number, required: true },
    endTime:   { type: Number, required: true },
    tracks:    { type: Array, "default": [] }
  });

  PollSchema.methods.upvote = function (username, trackIndex, hollaback) {
    redis.hincrby(createTrackKey(this, trackIndex), username, 1, function (err) {
      if (err) {
        hollaback(err);
      } else {
        hollaback();
      }
    });
  };

  PollSchema.methods.downvote = function (username, trackIndex, hollaback) {
    redis.hincrby(createTrackKey(this, trackIndex), username, -1, function (err) {
      if (err) {
        hollaback(err);
      } else {
        hollaback();
      }
    });
  };

  PollSchema.methods.getTrackData = function (trackIndex, hollaback) {
    var track = this.tracks[trackIndex];

    if (typeof track === "undefined") {
      hollaback("Track at index \"" + trackIndex + "\" does not exist");
    } else {
      trackService.getTrack(track, hollaback);
    }
  };

  PollSchema.methods.getAllTrackData = function (hollaback) {};

  PollSchema.methods.getTrackVotes = function (trackIndex, hollaback) {
    if (typeof this.tracks[trackIndex] === "undefined") {
      hollaback("Track of index \"" + trackIndex + "\" does not exist");
    } else {
      redis.hgetall(createTrackKey(this, trackIndex), function (err, votes) {
        var remapped = {};

        if (err) {
          hollaback(err);
        } else if (votes === null) {
          hollaback(null, {});
        } else {
          // remap votes into integers
          Object.keys(votes).forEach(function (voter) {
            remapped[voter] = parseInt(votes[voter], 10);
          });

          hollaback(null, remapped);
        }
      });
    }
  };

  PollSchema.methods.getAllTrackVotes = function (hollaback) {
    var promises = [],
        i = 0,
        length = this.tracks.length;

    for (; i < length; i++) {
      promises.push(Q.ninvoke(this, "getTrackVotes", i));
    }

    // TODO: handle error
    Q.all(promises).then(function (votes) {
      hollaback(null, votes);
    });
  };

  PollSchema.statics.createBoundaryTime   = createBoundaryTime;
  PollSchema.statics.createDateFromString = createDateFromString;
  PollSchema.statics.createStringFromDate = createStringFromDate;

  return mongoose.model("Poll", PollSchema);
};

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

function createTrackKey(poll, trackIndex) {
  return poll.date + ":" + poll.tracks[trackIndex];
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
