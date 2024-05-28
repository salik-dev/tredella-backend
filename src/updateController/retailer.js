const catchAsync = require("../utils/catchAsync");
// const constant = require("../utils/constant");
const constant = require("../updateUtils/constant");
const  generalService = require("../updateServices/generalOperation");
const { addRecord, getRecordAndSort, findAndModifyRecord, removeRecord } = require("../updateServices/commonOperation");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const  _ = require("lodash");
const guid = require("guid");
const { incrementField } = require("../utils/commonFunctions");
const countriesList = require("../utils/countriesList");
const saltRounds = 10;
const modelName = "allUser";

const addRetailer = catchAsync(async (req, res) => {
  const {fullName, userName, email, phoneNumber, password, platForm, status} = req.body;
  const role = "retailer";
  // Need to implement Global Validation Utils ==> pending
  const retailerUser = await addRecord(modelName, {fullName, userName, email, phoneNumber, password, platForm, status, role});
  retailerUser = await 

  res.status(constant.STATUS_OK).json({
    message: constant.USER_REGISTER_SUCCESS,
    data: retailerUser
  });

});
const signIn = catchAsync(async (req, res, next) => {
  const data = req.body;
  passport.authenticate("local", {}, (err, user, info) => {
    if (err || !user) {
      res.status(400).send({
        status: constant.ERROR,
        message: constant.PHONE_NUMBER_PASSWORD_ERROR,
      });
      return;
    }
    req.logIn(user, async (err) => {
      if (err) {
        res.status(400).send({
          status: constant.ERROR,
          message: err.message,
        });
        return;
      }

      if (user.status === "active") {
        let data = _.pick(user, [...userFieldSendFrontEnd, "token"]);
        res.append("x-auth", data.token);
        res.append("Access-Control-Expose-Headers", "x-auth");

        res.status(200).send({
          status: constant.SUCCESS,
          message: constant.USER_LOGIN_SUCCESS,
          user: data,
        });
      } else {
        res.status(400).send({
          status: constant.ERROR,
          message: "your account is not active. kindly contact with admin",
        });
        return;
      }
    });
  })(req, res, next);
});
const updateProfile = catchAsync(async (req, res, next) => {
  const {fullName, userName, email, phoneNumber, password, platForm, status, role} = req.body;


  // const user = req.user;
  const {id} = req.params
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

const getProfile = catchAsync(async (req, res) => {
  // const user = req.user; // use when JWT auth active
  // const {id} = req.params;
 const condition = {role: "retailer"}

  // let aggregateArr = [
  //   { $match: { _id: id } },
  //   {
  //     $project: {
  //       fullName: 1,
  //       userName: 1,
  //       email: 1,
  //       phoneNumber: 1,
  //       status: 1,
  //       role: 1,
  //     },
  //   },
  // ];
  // let Record = await generalService.getRecordAggregate(modelName, aggregateArr);
  const data = await getRecordAndSort(modelName, condition)

  res.send({
    status: constant.SUCCESS,
    message: "Record fetch Successfully",
    // Record: Record[0],
    data
  });
});

const deleteRecord = catchAsync(async (req, res) => {
  // const data = req.body;
  const {id} = req.params;

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
  addRetailer,
  signIn,
  updateProfile,
  getProfile,
  deleteRecord,
};
