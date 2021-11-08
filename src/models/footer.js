"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FooterSchema = Schema({
  title: String,
  email: String,
  subTitle: String,
  copyright: String,
  showContact: Boolean,
  linkPages: Object,
  image: String,
});

module.exports = mongoose.model("Footer", FooterSchema);
