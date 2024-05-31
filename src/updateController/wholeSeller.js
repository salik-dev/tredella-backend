const catchAsync = require("../utils/catchAsync");
const constant = require("../updateUtils/constant");
const {
  getRecordAndSort,
  findAndModifyRecord,
  removeRecord,
} = require("../updateServices/commonOperation");

const modelName = "allUser";

const updateWholeSeller = catchAsync(async (req, res, next) => {
  const {
    fullName,
    userName,
    email,
    phoneNumber,
    password,
    platForm,
    status,
    role,
  } = req.body;

  // const user = req.user;
  const { id } = req.params;
  const wholeSellerRecord = await findAndModifyRecord(
    modelName,
    { _id: id },
    { fullName, userName, email, phoneNumber, password, platForm, status, role }
  );

  res.status(200).send({
    status: constant.SUCCESS,
    message: constant.PROFILE_UPDATE_SUCCESS,
    Record: wholeSellerRecord,
  });
});

const getWholeSeller = catchAsync(async (req, res) => {
  const condition = { role: "wholeSeller" };
  const Record = await getRecordAndSort(modelName, condition);

  res.send({
    status: constant.SUCCESS,
    message: "Record fetch Successfully",
    Record,
  });
});

const deleteWholeSeller = catchAsync(async (req, res) => {
  const { id } = req.body;

  const Record = await removeRecord(modelName, {
    _id: id,
  });

  res.send({
    status: constant.SUCCESS,
    message: constant.DELETE_RECORD,
    Record,
  });
});

const testSalik = catchAsync(async (req, res) => {
  res.send({
    message: "test salik",
  });
});

module.exports = {
  updateWholeSeller,
  getWholeSeller,
  deleteWholeSeller,
  testSalik,
};
