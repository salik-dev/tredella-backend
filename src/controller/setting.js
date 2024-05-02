const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation");
const catchAsync = require("../utils/catchAsync");

const TableName = "Setting";

const getRecord = catchAsync(async (req, res) => {
  let Record = await generalService.getRecordAndSort(
    TableName,
    {},
    {
      createdAt: -1,
    }
  );
  let RecordObj = null;
  if (Record && Record.length > 0) {
    RecordObj = Record[0];
  }

  res.send({
    status: constant.SUCCESS,
    message: "activity fetch Successfully",
    Record: RecordObj,
  });
});
const getRecordVat = catchAsync(async (req, res) => {
  let condition = {
    vatFee: {
      $exists: true,
      $ne: [],
    },
  };

  const Record = await generalService.getRecordAndSort(TableName, condition, {
    createdAt: -1,
  });

  res.send({
    status: constant.SUCCESS,
    message: "activity fetch Successfully",
    Record,
  });
});

const addRecord = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;
  data.createdBy = user._id;
  let Record = [];
  if (data._id) {
    Record = await generalService.findAndModifyRecord(TableName, { _id: data._id }, data);
  } else {
    Record = await generalService.addRecord(TableName, data);
  }

  res.send({
    status: constant.SUCCESS,
    message: "add Record Successfully",
    Record,
  });
});
const addVisitor = catchAsync(async (req, res) => {
  let ip_address = req.ip;

  let startTime = new Date(new Date().setHours(0, 0, 0, 0)); // Set time to 00:00
  let endTime = new Date(new Date().setHours(23, 59, 59, 999)); // Set time to 23:59 (one minute before midnight)
  let condition = {
    ip_address: ip_address,
    createdAt: {
      $gte: startTime,
      $lte: endTime,
    },
  };

  let Record = [];
  let checkRecord = await generalService.getRecord("Visitor", condition);
  if (checkRecord && checkRecord.length === 0) {
    Record = await generalService.addRecord("Visitor", {
      ip_address: ip_address,
      user_agent: req.headers["user-agent"],
    });
  }

  res.send({
    status: constant.SUCCESS,
    message: "add Record Successfully",
    Record,
  });
});
const addFinance = catchAsync(async (req, res) => {
  let data = req.body;
  let ip_address = req.ip;

  let startTime = new Date(new Date().setHours(0, 0, 0, 0)); // Set time to 00:00
  let endTime = new Date(new Date().setHours(23, 59, 59, 999)); // Set time to 23:59 (one minute before midnight)

  let condition = {
    ip_address: ip_address,
    type: data.type,
    createdAt: {
      $gte: startTime,
      $lte: endTime,
    },
  };

  let Record = [];
  let checkRecord = await generalService.getRecord("FinanceForm", condition);
  if (checkRecord && checkRecord.length === 0) {
    Record = await generalService.addRecord("FinanceForm", {
      ip_address: ip_address,
      user_agent: req.headers["user-agent"],
      type: data.type,
    });
  }

  res.send({
    status: constant.SUCCESS,
    message: "add Record Successfully",
    Record,
  });
});

module.exports = {
  getRecord,
  getRecordVat,
  addRecord,
  addVisitor,
  addFinance,
};
