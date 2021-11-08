"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GeneralOptionsSchema = Schema({
  wsNumber: String,
  themeType: String,
  showButton: Boolean,
  systemLogo: String,
  socialMedia: Object,
  styles: Object,
});

module.exports = mongoose.model("GeneralOptions", GeneralOptionsSchema);
