"use strict";

var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");
var Schema = mongoose.Schema;

var schemaOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
};

var UserSchema = Schema(
  {
    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    role: String,
    subject: String,
    message: String,
    number: String,
  },
  schemaOptions
);

UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};
UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("User", UserSchema);
//lowercase and pluralize User => users
