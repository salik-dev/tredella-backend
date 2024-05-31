const catchAsync = require("../utils/catchAsync");
const constant = require("../updateUtils/constant");
const { getRecordAndSort, findAndModifyRecord, removeRecord } = require("../updateServices/commonOperation");
const modelName = "allUser";

const updateBuyer = catchAsync(async (req, res, next) => {
  let {fullName, userName, email, phoneNumber, password, platForm, status, role} = req.body;
  role = "buyer";
  const {id} = req.body;
  const userRecord = await findAndModifyRecord(
    modelName,
    { _id: id },
    {fullName, userName, email, phoneNumber, password, platForm, status, role}
  );

  res.status(200).send({
    status: constant.SUCCESS,
    message: constant.PROFILE_UPDATE_SUCCESS,
    Record: userRecord,
  });
});
const getBuyer = catchAsync(async (req, res) => {
  const condition = {role: "buyer"};
  const Record = await getRecordAndSort(modelName, condition)

  res.send({
    status: constant.SUCCESS,
    message: "Record fetch Successfully",
    Record,
  });
});
const deleteBuyer = catchAsync(async (req, res) => {
  const {id} = req.body;
  const Record = await removeRecord(modelName, {
    _id: id,
  });

  res.send({
    status: constant.SUCCESS,
    message: constant.DELETE_RECORD,
    data: { Record },
  });
});

module.exports = {
  updateBuyer,
  getBuyer,
  deleteBuyer,
};
