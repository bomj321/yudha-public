"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AwesomeServiceSchema = Schema({
  title: String,
  subTitle: String,
});

module.exports = mongoose.model("AwesomeService", AwesomeServiceSchema);
