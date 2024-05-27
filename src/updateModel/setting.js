"use strict";
const mongoose = require("mongoose");

const Setting = new mongoose.Schema(
  {
    administrationFee: [
      {
        min: {
          type: Number,
          default: 0,
        },
        max: {
          type: Number,
          default: 0,
        },
        feeType: {
          type: String,
          enum: ["percentage", "fixed"],
          default: "fixed",
        },
        tax: {
          type: Number,
          default: 0,
        },
      },
    ],
    vatFee: [
      {
        min: {
          type: Number,
          default: 0,
        },
        max: {
          type: Number,
          default: 0,
        },
        feeType: {
          type: String,
          enum: ["percentage", "fixed"],
          default: "fixed",
        },
        tax: {
          type: Number,
          default: 0,
        },
      },
    ],
    defaultFee: {
      defaultIncrement: {
        type: Number,
        default: 1,
      },
      defaultAuctionFee: {
        type: Number,
        default: 0,
      },
      defaultAuctionCommission: {
        type: Number,
        default: 0,
      },
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

mongoose.model("Setting", Setting);
