const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
});

const ChildCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
});

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    brands: {
      type: [BrandSchema],
    },
    childCategories: {
      type: [ChildCategorySchema],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "allUser",
    }
  },
  {
    timestamps: true,
  }
);

const subCategory = mongoose.model("subCategory", subCategorySchema);
module.exports = subCategory;
