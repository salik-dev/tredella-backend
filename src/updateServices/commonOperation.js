const mongoose = require("mongoose");
const Buyer = require("../updateModel/allUsers");
const RetailerCategory = require('../updateModel/category');
const SubCategory = require('../updateModel/subCategory');
const Store = require("../updateModel/store");

const addRecord = async (collectionName, reqData) => {
  const Collection = mongoose.model(`${collectionName}`);
  const data = new Collection(reqData);
  return await data.save();
};

const getRecordAndSort = async (collectionName, condition, sort) => {
  const Collection = mongoose.model(`${collectionName}`);
  return await Collection.find(condition).sort(sort);
};

const findAndModifyRecord = async (collectionName, condition, update) => {
    const Collection = mongoose.model(`${collectionName}`);
    return await Collection.findOneAndUpdate(condition, update, {
      upsert: true,
      returnNewDocument: true,
      new: true,
    });
  }

const removeRecord = async (collectionName, condition) => {
    const Collection = mongoose.model(`${collectionName}`);
    return await Collection.deleteMany(condition);
  }

module.exports = { addRecord, getRecordAndSort, findAndModifyRecord, removeRecord};
