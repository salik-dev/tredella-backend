"use strict";
const mongoose = require("mongoose");

const RetailerSubCategory = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    retailerCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RetailerCategory",
    },
    percentage: {
      type: Number,
      required: true,
    },
    brands: {
      type: Array,
    },
    childCategories: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.model("RetailerSubCategory", RetailerSubCategory);
