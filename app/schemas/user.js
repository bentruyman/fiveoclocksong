var Schema = require("mongoose").Schema;

module.exports = function (config) {
  var UserSchema = new Schema({
    name: { type: String, required: true, index: true },
    password: { type: String, required: true, set: hashPassword }
  });

  UserSchema.methods.verifyCredentials = function (password, hollaback) {};

  function hashPassword(str) {

  }

  return UserSchema;
};
