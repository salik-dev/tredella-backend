"use strict";
const mongoose = require("mongoose");

const RetailerCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'retailer category is required'],
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const retailerCategory = mongoose.model("RetailerCategory", RetailerCategorySchema);
module.exports = retailerCategory;
