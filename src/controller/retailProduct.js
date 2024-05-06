const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { incrementField } = require("../utils/commonFunctions");
const { default: mongoose } = require("mongoose");
const TableName = "RetailerProducts";

const getRecord = catchAsync(async (req, res) => {
  const condition = {};
  const Record = await generalService.getRecord(TableName, condition);
  res.send({
    status: constant.SUCCESS,
    message: "Activity fetch Successfully",
    Record,
  });
});
const getProductByUser = catchAsync(async (req, res) => {
  const user = req.user;
  let condition = { createdBy: user._id };
  const Record = await generalService.getRecord(TableName, condition);
  res.send({
    status: constant.SUCCESS,
    message: "Activity fetch Successfully",
    Record,
  });
});
const addRecord = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;
  const productId = await incrementField(TableName, "productId", "rp", {});
  data.productId = productId;
  data.createdBy = user._id;
  const Record = await generalService.addRecord(TableName, data);
  res.send({
    status: constant.SUCCESS,
    message: "Add Record Successfully",
    Record,
  });
});
const editRecord = catchAsync(async (req, res) => {
  const data = req.body;

  const Record = await generalService.findAndModifyRecord(
    TableName,
    { _id: data._id },
    data
  );

  res.send({
    status: constant.SUCCESS,
    message: "Update Record Successfully",
    Record,
  });
});
const deleteRecord = catchAsync(async (req, res) => {
  const data = req.body;
  const Record = await generalService.deleteRecord(TableName, {
    _id: data._id,
  });

  res.send({
    status: constant.SUCCESS,
    message: "Record Deleted Successfully",
    Record: { _id: data._id },
  });
});

module.exports = {
  getRecord,
  addRecord,
  editRecord,
  deleteRecord,
  getProductByUser,
};
