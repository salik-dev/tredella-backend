const catchAsync = require("../utils/catchAsync");
const constant = require("../updateUtils/constant");
const { addRecord, getRecordAndSort, findAndModifyRecord, removeRecord } = require("../updateServices/commonOperation");
const modelName = "allUser";

const updateRetailer = catchAsync(async (req, res, next) => {
  const {fullName, userName, email, phoneNumber, password, platForm, status, role} = req.body;


  // const user = req.user;
  const {id} = req.body;
  const retailerRecord = await findAndModifyRecord(
    modelName,
    { _id: id },
    {fullName, userName, email, phoneNumber, password, platForm, status, role}
  );

  res.status(200).send({
    status: constant.SUCCESS,
    message: constant.PROFILE_UPDATE_SUCCESS,
    Record: retailerRecord,
  });
});

const getRetailer = catchAsync(async (req, res) => {
 const condition = {role: "retailer"}
  const Record = await getRecordAndSort(modelName, condition)

  res.send({
    status: constant.SUCCESS,
    message: "Record fetch Successfully",
    // Record: Record[0],
    Record
  });
});

const deleteRetailer = catchAsync(async (req, res) => {
  // const Record = req.body;
  const {id} = req.body;

  const Record = await removeRecord(modelName, {
    _id: id,
  });

  res.send({
    status: constant.SUCCESS,
    message: constant.DELETE_RECORD,
    Record,
  });
});

module.exports = {
  updateRetailer,
  getRetailer,
  deleteRetailer,
};
