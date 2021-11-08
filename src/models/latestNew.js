"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LatestNewSchema = Schema({
  title: String,
  subTitle: String,
});

module.exports = mongoose.model("LatestNew", LatestNewSchema);
