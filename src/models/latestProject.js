"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LatestProjectSchema = Schema({
  title: String,
  subTitle: String,
});

module.exports = mongoose.model("LatestProject", LatestProjectSchema);
