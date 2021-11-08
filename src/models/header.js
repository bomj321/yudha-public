"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HeaderSchema = Schema({
  description: String,
  image: String,
  links: Object,
});

module.exports = mongoose.model("Header", HeaderSchema);
