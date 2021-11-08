"use strict";

var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");

var Schema = mongoose.Schema;

var ServiceSchema = Schema({
  bannerImage: String,
  bannerTitle: String,
  subTitle: String,
  subTitleText: String,
  icon: String,

  firstMediaLink: String,
  firstMediaUrl: String,
  benefitsList: Array,

  secondMediaLink: String,
  secondMediaUrl: String,
  promisesText: String,

  thirdMediaLink: String,
  thirdMediaUrl: String,
  whoIAmText: String,
  titleBenefits: String,
  titlePromises: String,
  titleWhoIAmText: String,
  finalText: String,
});

ServiceSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Service", ServiceSchema);
