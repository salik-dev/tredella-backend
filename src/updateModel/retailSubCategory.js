"use strict";
const mongoose = require("mongoose");

const RetailerSubCategory = new mongoose.Schema(
  {
    subCategoryId: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  },
  {
    timestamps: true,
  }
);

const retailerSubCategory = mongoose.model("RetailerSubCategory", RetailerSubCategory);
module.exports = retailerSubCategory