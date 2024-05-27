"use strict";
const mongoose = require("mongoose");

const Packages = new mongoose.Schema(
  {
    packageId: {
      type: String,
    },
    name: {
      type: String,
      trim: false,
      required: false,
      unique: false,
      lowercase: true,
    },
    duration: {
      type: String,
      enum: ["monthly", "yearly"],
    },
    price: {
      type: Number,
    },
    for: {
      type: String,
      enum: ["retailer", "wholeSeller"],
    },
    allowPoints: {
      type: Array,
    },
    disallowPoints: {
      type: Array,
    },
    off: {
      type: Number,
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

mongoose.model("Packages", Packages);
