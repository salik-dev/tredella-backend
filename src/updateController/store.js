const catchAsync = require("../utils/catchAsync");
const constant = require("../updateUtils/constant");
const { addRecord, getRecordAndSort, findAndModifyRecord, removeRecord } = require("../updateServices/commonOperation");
const modelName = "store";

const addStore = catchAsync(async (req, res) => {
  const { name, categories } = req.body;

  const newStore = await addRecord(modelName, { name, categories });

  res.status(constant.STATUS_OK).json({
    message: "Store created successfull",
    Record: newStore
  });
});

const updateStore = catchAsync(async (req, res) => {
  const { id, name, categories } = req.body;

  const updatedStore = await findAndModifyRecord(
    modelName,
    { _id: id },
    { name, categories }
  );

  res.status(constant.STATUS_UPDATE).json({
    status: constant.SUCCESS,
    message: "Store updated successfull",
    Record: updatedStore,
  });
});

const getStore = catchAsync(async (req, res) => {
  const condition = {};

  const store = await getRecordAndSort(modelName, condition)

  res.status(constant.STATUS_OK).json({
    message: "Store Data Fetched",
    Record: store,
  });
});

const deleteStore = catchAsync(async (req, res) => {
  const { id } = req.body;

  const deletedStore = await removeRecord(modelName, { _id: id });

  res.status(constant.STATUS_OK).json({
    message: "Store Deleted.",
    Record: deletedStore,
  });
});

module.exports = {
  addStore,
  updateStore,
  getStore,
  deleteStore,
};
