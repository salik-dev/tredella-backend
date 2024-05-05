const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");
const { incrementField } = require("../utils/commonFunctions");
const { default: mongoose } = require("mongoose");
const TableName = "Packages";

const getRecord = catchAsync(async (req, res) => {
  const condition = {};
  const Record = await generalService.getRecord(TableName, condition);
  res.send({
    status: constant.SUCCESS,
    message: "activity fetch Successfully",
    Record,
  });
});
const getPublicPackage = catchAsync(async (req, res) => {
  const aggregateArray = [
    { $match: {} },
    {
      $project: {
        _id: 1,
        packageId: 1,
        name: 1,
        duration: 1,
        price: 1,
        for: 1,
        allowPoints: 1,
        disallowPoints: 1,
        off: 1,
        createdAt: 1,
      },
    },
  ];
  const Record = await generalService.getRecordAggregate(
    TableName,
    aggregateArray
  );
  res.send({
    status: constant.SUCCESS,
    message: "activity fetch Successfully",
    Record,
  });
});
const addRecord = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;
  const packageId = await incrementField(TableName, "packageId", "p", {});
  data.packageId = packageId;
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
  getPublicPackage,
};
