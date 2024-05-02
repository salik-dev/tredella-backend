"use strict";
const mongoose = require("mongoose");

const favoriteAuction = new mongoose.Schema(
  {
    favoriteBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
    },
    auctionCreatedBy: {
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

mongoose.model("favorite", favoriteAuction);
