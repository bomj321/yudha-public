"use strict";

var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate-v2");

var Schema = mongoose.Schema;

var TabSchema = Schema({
  nameTab: String,
  description: String,
  showTab: Boolean,
});

TabSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Tab", TabSchema);
