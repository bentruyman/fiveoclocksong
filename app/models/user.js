var Schema = require("mongoose").Schema;

module.exports = function (mongoose) {
  return mongoose.model("User", UserSchema);
};

var UserSchema = exports.Schema = new Schema({
  name: { type: String, required: true, index: true },
  password: { type: String, required: true, set: hashPassword }
});

UserSchema.methods.verifyCredentials = function (password, hollaback) {};

UserSchema.statics.hashPassword = hashPassword;

function hashPassword(str, callback) {

}
