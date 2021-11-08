"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AboutMeSchema = Schema({
  title: String,
  description: String,
  image: String,
});

module.exports = mongoose.model("AboutMe", AboutMeSchema);
