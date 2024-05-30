const mongoose = require('mongoose');
const { Schema } = mongoose;

// Subcategory Schema
const subCategorySchema = new Schema({
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: mongoose.Schema.Types.ObjectId,
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
  categories: [categorySchema] // array of category schemas
});

// Create the Store model
const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
