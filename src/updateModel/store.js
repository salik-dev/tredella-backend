const mongoose = require('mongoose');
const { Schema } = mongoose;
const {ObjectId} = mongoose.Schema.Types;

// Subcategory Schema
const subCategorySchema = new Schema({
  subCategoryId: {
    type: ObjectId,
    ref: "subCategory",
    required: true,
  },
  percent: {
    type: Number,
    required: true
  }
});

// Category Schema
const categorySchema = new Schema({
  categoryId: {
    type: ObjectId,
    ref: "category",
    required: true,
  },
  subCategories: [subCategorySchema] // array of subcategory schemas
});

// Store Schema
const storeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  categories: [categorySchema],  // array of category schemas
  createdBy: {
    type: ObjectId,
    ref: "allUser"
  }
});

// Create the Store model
const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
