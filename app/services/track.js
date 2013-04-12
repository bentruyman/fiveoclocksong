var q = require("q"),
    Spotify = require("spotify-web"),
    config = require("../../config");

var trackService = module.exports = {};

trackService.getTrackById = function (id, hollaback) {
  _getSpotify(function (spotify) {
    spotify.get(createTrackURL(id), function (err, track) {
      console.log(arguments);
    });
  });
};

trackService.getTracksByIds = function (ids, hollaback) {};

trackService.getRandomTracks = function (playlistId, limit, hollaback) {};

trackService.createPlaylistURL = function (userId, playlistId) {
  return "spotify:user:" + userId + ":playlist:" + playlistId;
};

trackService.createTrackURL = function (id) {
  return "spotify:track:" + id;
};

trackService._getSpotify = function (hollaback) {
  Spotify.login(config.spotify.username, config.spotify.password, function (err, spotify) {
    if (err) { throw err; }

    hollaback(spotify);
  });
};

trackService.Track = function (source) {};
