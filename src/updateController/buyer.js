// JWT Import
const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");
const constant = require("../updateUtils/constant");
const { addRecord, getRecordAndSort, findAndModifyRecord, removeRecord } = require("../updateServices/commonOperation");
const passport = require("passport");
const  _ = require("lodash");
const modelName = "allUser";

let userFieldSendFrontEnd = [
  "_id",
  "email",
  "userId",
  "fullName",
  "phoneNumber",
  "role",
  "status",
  "address",
  "postalCode",
  "place",
  "country",
  "createdAt",
  "token",
  "profileCompleted",
  "profileImageUrl",
  "favourites",
];
const signUp = catchAsync(async (req, res) => {
  const {fullName, userName, email, phoneNumber, password, platForm, status} = req.body;
  const role = "buyer"
  // Need to implement Global Validation Utils ==> pending
  const buyerUser = await addRecord(modelName, {fullName, userName, email, phoneNumber, password, platForm, status, role});
  let token = null;
  if(buyerUser){
    token = jwt.sign({id: buyerUser?._id}, process.env.SECRETE_STRING, {
    expiresIn: process.env.LOGIN_EXPIRES_IN
    })
  }
  else{
    return res.status(500).json({
      message: "Something Went Wrong Try Again!",
      Record: null,
    })
  }

  res.status(constant.STATUS_OK).json({
    message: constant.USER_REGISTER_SUCCESS,
    token,
    Record: buyerUser
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
  const {id} = req.body;
  console.log('update data', req.body, req.para)
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
const getProfile = catchAsync(async (req, res) => {
  // const user = req.user; // use when JWT auth active
  // const {id} = req.params;
  const condition = {role: "buyer"};

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
  const Record = await getRecordAndSort(modelName, condition)

  res.send({
    status: constant.SUCCESS,
    message: "Record fetch Successfully",
    // Record: Record[0],
    Record,
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
  signUp,
  signIn,
  updateProfile,
  getProfile,
  deleteRecord,
};
