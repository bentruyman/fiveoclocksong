var bcrypt = require("bcrypt"),
    Schema = require("mongoose").Schema,
    config = require("../../config");

module.exports = function (mongoose) {
  return mongoose.model("User", UserSchema);
};

var UserSchema = exports.Schema = new Schema({
  name: { type: String, required: true, index: true },
  password: { type: String, required: true, set: hashPassword }
});

UserSchema.methods.verifyCredentials = function (password, hollaback) {
  bcrypt.compare(password, this.password, function (err, res) {
    hollaback(err, res);
  });
};

UserSchema.statics.hashPassword = hashPassword;

function hashPassword(str) {
  // TOOD: should not be sync...
  return bcrypt.hashSync(str, config.security.workFactor);
}
