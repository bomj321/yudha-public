"use strict";

var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");

var Schema = mongoose.Schema;

var ProjectSchema = Schema({
  bannerTitle: String,
  bannerImage: String,
  paragraph: String,
  additionalImage: String,
  videoLink: String,
});

ProjectSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Project", ProjectSchema);
