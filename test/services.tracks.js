var should = require("should"),
    sinon = require("sinon");

var TrackService = require("../app/services/track");

describe("Track Service", function () {
  var trackService;

  function inArray(needle, haystack) {
    var i = 0,
        length = haystack.length;

    for (; i < length; i++) {
      if (haystack[i] === needle) {
        return true;
      }
    }

    return false;
  }

  before(function (done) {
    this.timeout(5000);

    var username = process.env.SPOTIFY_USERNAME,
        password = process.env.SPOTIFY_PASSWORD;

    trackService = new TrackService(username, password);
    trackService.open(function (err) {
      if (err) { throw err; }

      done();
    });
  });

  after(function () {
    trackService.close();
  });

  describe("Playlists", function () {
    this.timeout(5000);

    it("should return a list of tracks alphabetically sorted by name", function (done) {
      var playlistURI = "spotify:user:bentruyman:playlist:2dyVZw6oHMiwqiA8XDIxcs";

      trackService.getPlaylist(playlistURI, function (err, tracks) {
        tracks[0].name.should.equal("Anything Goes");
        tracks[1].name.should.equal("Bullet");
        tracks[2].name.should.equal("Never Gonna Give You Up");
        tracks[3].name.should.equal("The Chain");
        tracks[4].name.should.equal("Tom Sawyer");
        tracks[5].name.should.equal("Youth");

        done();
      });
    });

    describe("Random", function () {
      this.timeout(5000);

      it("should return a random list of tracks from a specified playlist", function (done) {
        var limit = 2,
            playlistURI = "spotify:user:bentruyman:playlist:2dyVZw6oHMiwqiA8XDIxcs",
            trackNames = [
              "Anything Goes",
              "Bullet",
              "Never Gonna Give You Up",
              "The Chain",
              "Tom Sawyer",
              "Youth"
            ];

        trackService.getRandomTracks(playlistURI, limit, function (err, tracks) {
          if (err) { throw err; }

          tracks.length.should.equal(limit);
          inArray(tracks[0].name, trackNames).should.be.true;
          inArray(tracks[1].name, trackNames).should.be.true;

          done();
        });
      });

      it("should provide an error message if the specified limit is above the number of available tracks", function (done) {
        trackService.getRandomTracks("spotify:user:bentruyman:playlist:2dyVZw6oHMiwqiA8XDIxcs", 1e5, function (err) {
          should.exist(err);
          done();
        });
      });
    });
  });

  describe("Tracks", function () {
    this.timeout(5000);

    it("should return a specified track", function (done) {
      var trackId = "spotify:track:0FutrWIUM5Mg3434asiwkp";

      trackService.getTrack(trackId, function (err, track) {
        if (err) { throw err; }

        track.name.should.equal("Never Gonna Give You Up");
        track.artist.should.equal("Rick Astley");

        done();
      });
    });

    it("should return a list of specified tracks", function (done) {
      var trackIds = [
        "spotify:track:0FutrWIUM5Mg3434asiwkp",
        "spotify:track:2X6gdRlGOQgfaXU9ALUQFQ"
      ];

      trackService.getTracks(trackIds, function (err, tracks) {
        if (err) { throw err; }

        tracks.length.should.equal(2);
        tracks[0].name.should.equal("Never Gonna Give You Up");
        tracks[0].artist.should.equal("Rick Astley");
        tracks[1].name.should.equal("The Chain");
        tracks[1].artist.should.equal("Fleetwood Mac");

        done();
      });
    });
  });
});
