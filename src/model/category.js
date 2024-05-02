"use strict";
const mongoose = require("mongoose");

const Category = new mongoose.Schema(
  {
    categoryId: {
      type: Number,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    categoryImage:{
      type: String,
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

mongoose.model("Category", Category);
