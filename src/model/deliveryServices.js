"use strict";
const mongoose = require("mongoose");

const DeliveryService = new mongoose.Schema(
  {
    deliveryId: {
      type: String,
    },
    deliveryServicesName: {
      type: String,
      trim: false,
      required: false,
      unique: false,
      lowercase: true,
    },
    deliveryServicesLink: {
      type: String,
    },
    deliveryServicesFees: {
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

mongoose.model("DeliveryService", DeliveryService);
