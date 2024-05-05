"use strict";
const mongoose = require("mongoose");

const WholeSellerStores = new mongoose.Schema(
  {
    storeId: {
      type: String,
    },
    name: {
      type: String,
      trim: false,
      required: false,
      unique: false,
      lowercase: true,
    },
    description: {
      type: String,
    },
    categories: {
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

mongoose.model("WholeSellerStores", WholeSellerStores);
