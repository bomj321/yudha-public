"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HireSchema = Schema({
  title: String,
  paragraph: String,
  showForm: Boolean,
  image: String,
});

module.exports = mongoose.model("Hire", HireSchema);
