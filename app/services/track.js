var Q = require("q"),
    Spotify = require("spotify-web");

var TrackService = module.exports = function (username, password) {
  this.username = username;
  this.password = password;
  this._client  = null;
};

TrackService.prototype.open = function (hollaback) {
  var self = this;

  Spotify.login(this.username, this.password, function (err, spotify) {
    if (err) {
      hollaback(err);
    } else {
      self._client = spotify;
      hollaback(null);
    }
  });
};

TrackService.prototype.close = function () {
  this._client.disconnect();
};

TrackService.prototype.getPlaylist = function (playlistId, hollaback) {
  var self = this;

  this._client.playlist(playlistId, function (err, playlist) {
    var trackIds,
        promises = [];

    if (err) {
      hollaback(err);
    } else {
      trackIds = playlist.contents.items.map(function (item) {
        return item.uri;
      });

      hollaback(null, trackIds);
    }
  });
};

TrackService.prototype.getRandomTracks = function (playlistId, limit, hollaback) {
  var self = this;

  this.getPlaylist(playlistId, function (err, ids) {
    var randoms = [];

    if (err) {
      hollaback(err);
    } else {
      if (limit > ids.length) {
        hollaback("Not enough tracks to satisfy a limit of \"" + limit + "\"");
      } else {
        while(limit > randoms.length) {
          randoms.push(ids.splice(Math.floor(Math.random() * ids.length))[0]);
        }

        hollaback(null, randoms);
      }
    }
  });
};

TrackService.prototype.getTrack = function (trackId, hollaback) {
  this._client.get(trackId, function (err, track) {
    if (err) {
      hollaback(err);
    } else {
      hollaback(null, formatTrack(track));
    }
  });
};

TrackService.prototype.getTracks = function (trackIds, hollaback) {
  var self = this,
      promises = [];

  trackIds.forEach(function (id) {
    promises.push(Q.ninvoke(self, "getTrack", id));
  });

  // TODO: handle error
  Q.all(promises).then(function (tracks) {
    var sorted = tracks.sort(function (a, b) {
      return a.name > b.name;
    });

    hollaback(null, sorted);
  });
};

TrackService._formatTrack = formatTrack;

function formatTrack(source) {
  return {
    name:   source.name,
    artist: source.artist[0].name
  };
}
