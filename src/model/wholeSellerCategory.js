"use strict";
const mongoose = require("mongoose");

const WholeSellerCategory = new mongoose.Schema(
  {
    categoryId: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
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

mongoose.model("WholeSellerCategory", WholeSellerCategory);
