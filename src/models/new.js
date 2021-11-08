"use strict";

var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");

var Schema = mongoose.Schema;

var NewSchema = Schema({
  bannerTitle: String,
  bannerDate: String,
  bannerImage: String,
  paragraph: String,
  featuredImage: String,
  paragraphTwo: String,
  leftImage: String,
  rightParagraph: String,
  paragraphThree: String,
  videoLink: String,
  videoImage: String,
  paragraphFour: String,
  showForm: Boolean,
});

NewSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("New", NewSchema);
