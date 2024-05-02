"use strict";
const mongoose = require("mongoose");

const SubCategory = new mongoose.Schema(
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
    imageUrl: {
      type: String,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormTemplate",
      default: null,
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

mongoose.model("SubCategory", SubCategory);
