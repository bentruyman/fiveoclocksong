var Schema = require("mongoose").Schema;

var UserSchema = module.exports = new Schema({
  name: { type: String, required: true, index: true },
  password: { type: String, required: true, set: hashPassword }
});

UserSchema.methods.verifyCredentials = function (password, hollaback) {};

UserSchema.statics.hashPassword = hashPassword;

function hashPassword(str) {}
