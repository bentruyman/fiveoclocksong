var bcrypt = require("bcrypt"),
    Schema = require("mongoose").Schema,
    config = require("../../config");

module.exports = function (mongoose) {
  return mongoose.model("User", UserSchema);
};

var UserSchema = exports.Schema = new Schema({
  name: { type: String, required: true, index: true },
  _password: { type: String, required: true }
});

UserSchema.methods.setPassword = function (password, hollaback) {
  var self = this;

  bcrypt.genSalt(config.security.workFactor, function (err, salt) {
    if (err) {
      hollaback(err);
    } else {
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          hollaback(err);
        } else {
          self._password = hash;
          hollaback(null, hash);
        }
      });
    }
  });
};

UserSchema.methods.verifyCredentials = function (password, hollaback) {
  var currentPassword = this._password;

  if (typeof currentPassword === "undefined") {
    hollaback("User does not have a password.", false);
  } else {
    bcrypt.compare(password, currentPassword, function (err, res) {
      hollaback(err, res);
    });
  }
};

UserSchema.virtual("password", function () {
  return this._password;
});
