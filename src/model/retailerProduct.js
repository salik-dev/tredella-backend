"use strict";
const mongoose = require("mongoose");

const RetailerProducts = new mongoose.Schema(
  {
    productId: {
      type: String,
    },
    productImages: {
      type: Array,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
    },
    childCategory: {
      type: mongoose.Schema.Types.ObjectId,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
    },
    quantity: {
      type: Number,
    },
    deliveryService: {
      type: mongoose.Schema.Types.ObjectId,
    },
    deliveryWeight: {
      type: String,
    },
    deliveryFee: {
      type: Number,
    },
    minimumDeliveryTime: {
      type: Number,
    },
    maximumDeliveryTime: {
      type: Number,
    },
    saleDuration: {
      type: Array,
    },
    salePrice: {
      type: Number,
    },
    price: {
      type: Number,
    },
    categoryFee: {
      type: Number,
    },
    productColors: {
      type: Array,
    },
    productSizes: {
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

mongoose.model("RetailerProducts", RetailerProducts);
