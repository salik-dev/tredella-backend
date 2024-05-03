const catchAsync = require("../utils/catchAsync");
const constant = require("../utils/constant"),
  generalService = require("../services/generalOperation"),
  bcrypt = require("bcryptjs"),
  passport = require("passport"),
  _ = require("lodash");
const guid = require("guid");
const { incrementField } = require("../utils/commonFunctions");
const countriesList = require("../utils/countriesList");

const saltRounds = 10;
const TableName = "User";

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

const getUserRecord = async (condition) => {
  let aggregateArr = [
    {
      $match: condition,
    },
    {
      $lookup: {
        from: "auctions",
        let: { aId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$createdBy", "$$aId"] } } },
          {
            $project: {
              _id: 1,
            },
          },
        ],
        as: "TotalAuctions",
      },
    },
    {
      $project: {
        userId: 1,
        firstName: 1,
        lastName: 1,
        address: 1,
        postalCode: 1,
        place: 1,
        country: 1,
        acceptedAt: 1,
        vatFee: 1,
        administrationFee: 1,
        businessCustomer: 1,
        customFee: 1,
        companyNumber: 1,
        newsLetter: 1,
        termsAndCondition: 1,
        email: 1,
        phoneNumber: 1,
        status: 1,
        totalAuctions: { $size: "$TotalAuctions" },
        createdAt: 1,
        lastLogin: 1,
        companyName: 1,
        favourites: 1,
      },
    },
  ];
  let Record = await generalService.getRecordAggregate(TableName, aggregateArr);
  return Record;
};

const checkUser = catchAsync(async (req, res) => {
  const data = JSON.parse(req.params.query);
  console.log(data);
  let use = null;
  let check = await generalService.getRecord(TableName, {
    email: data.email,
    verifyPhoneNumber: true,
  });
  let arr = [];
  if (check && check.length > 0) {
    use = check[0];
    let token = await use.generateAuthToken();
    use.token = token;
    arr.push({ user: use });
  }
  return res.send({
    status: constant.SUCCESS,
    message: "user",
    Record: arr,
  });
});

const signUp = catchAsync(async (req, res) => {
  const data = req.body;
  let user = null;
  const userId = await incrementField("User", "userId", {});
  data.userId = userId;

  let check = await generalService.getRecord(TableName, {
    phoneNumber: data.phoneNumber,
  });
  console.log(check);
  if (check.length > 0 && check[0].verifyPhoneNumber == false) {
    // user = await generalService.addRecord(TableName, data);
    user = await generalService.updateRecord(
      TableName,
      { _id: check[0]._id },
      data
    );
    // user = check[0]
    let token = await user.generateAuthToken();
    user.token = token;

    //====== send otp code on mobile phone number here

    res.send({
      status: constant.SUCCESS,
      message: constant.USER_REGISTER_SUCCESS,
      user: _.pick(user, ["_id", "token", "verifyOtp", "otpCode"]),
    });
  } else {
    user = await generalService.addRecord(TableName, data);

    let token = await user.generateAuthToken();
    user.token = token;

    res.send({
      status: constant.SUCCESS,
      message: constant.USER_REGISTER_SUCCESS,
      user: _.pick(user, ["_id", "token", "verifyOtp", "otpCode"]),
    });
  }
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
  const data = req.body;
  const user = req.user;

  const Record = await generalService.findAndModifyRecord(
    TableName,
    { _id: user._id },
    data
  );
  let userRecord = _.pick(Record, userFieldSendFrontEnd);

  res.status(200).send({
    status: constant.SUCCESS,
    message: constant.PROFILE_UPDATE_SUCCESS,
    Record: userRecord,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  let data = req.body;
  console.log(data);
  const password = await bcrypt.hash(data.password, saltRounds);

  if (password) {
    const Record = await generalService.updateRecord(
      "User",
      {
        _id: data._id,
      },
      {
        password: password,
      }
    );

    if (Record) {
      res.send({
        status: constant.SUCCESS,
        message: constant.PASSWORD_RESET_SUCCESS,
        Record: _.pick(Record, [
          "_id",
          "firstName",
          "userId",
          "lastName",
          "role",
          "token",
          "userType",
          "phoneNumber",
          "email",
          "lastLogin",
        ]),
      });
    } else {
      res.send({
        status: constant.ERROR,
        message: constant.PASSWORD_RESET_ERROR,
      });
    }
  } else {
    res.send({
      status: constant.ERROR,
      message: constant.OLD_PASSWORD_ERROR,
    });
  }
});

const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email.toLowerCase();
  const authToken = guid.create().value;
  let url = "";

  const Record = await generalService.getRecord(TableName, {
    email: email,
  });

  if (Record.length > 0) {
    if (Record[0].status === "active") {
      await generalService.findAndModifyRecord(
        TableName,
        {
          _id: Record[0]._id,
        },
        {
          forgetPasswordAuthToken: authToken,
        }
      );

      if (Record[0].role === "superAdmin") {
        url = process.env.SUPER_ADMIN_URL + "/setNewPassword/" + authToken;
      }
      console.log("==========forget password url========", url);
      // const subjectForgotPassword = `Reset Password Email for ${process.env.PROJECT_NAME}`;
      // const sent = await sendEmail(
      //   email,
      //   subjectForgotPassword,
      //   emailTemplate.forgetPasswordEmail(url)
      // );
      const sent = "d";
      console.log("Record " + Record);
      if (sent) {
        res.status(200).send({
          status: constant.SUCCESS,
          message: constant.FORGOT_EMAIL_SENT_SUCCESS,
          Record: { token: authToken },
        });
      } else {
        res.status(500).send({
          status: constant.ERROR,
          message: constant.FORGOT_PASSWORD_EMAIL_ERROR,
        });
      }
    } else {
      res.status(500).send({
        status: constant.ERROR,
        message: constant.STATUS_BLOCK,
        showAlert: true,
      });
    }
  } else {
    res.status(200).send({
      status: constant.ERROR,
      message: constant.NO_SUCH_EMAIL,
    });
  }
});

const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  let obj = req.body;
  const password = await bcrypt.hash(obj.password, saltRounds);
  console.log(user);
  console.log(obj);
  console.log(password);
  const checkPassword = await generalService.getRecord(TableName, {
    _id: user._id,
  });
  console.log(checkPassword);

  const chk = await bcrypt.compare(obj.oldPassword, checkPassword[0].password);

  if (chk == false) {
    return res.send({
      status: constant.ERROR,
      message: constant.OLD_PASSWORD_ERROR,
    });
  }

  const userObj = await generalService
    .updateRecord(
      "User",
      {
        _id: user._id,
      },
      {
        password: password,
      }
    )
    .then((value) => {
      console.log(value);
      res.send({
        status: constant.SUCCESS,
        message: constant.PASSWORD_RESET_SUCCESS,
      });
    })
    .catch((e) => {
      res.send({
        status: constant.ERROR,
        message: constant.PASSWORD_RESET_ERROR,
      });
    });
});

const setNewPassword = catchAsync(async (req, res) => {
  const forgetPassAuthToken = req.body.forgetPasswordAuthToken;
  const password = req.body.password;
  const encryptPassword = await bcrypt.hash(password, saltRounds);
  const Record = await generalService.getRecord(TableName, {
    forgetPasswordAuthToken: forgetPassAuthToken,
  });
  if (Record && Record.length > 0) {
    const email = Record[0].email;

    await generalService.findAndModifyRecord(
      TableName,
      {
        _id: Record[0]._id,
      },
      {
        password: encryptPassword,
        forgetPasswordAuthToken: "",
      }
    );

    // const sent = await sendEmail(
    //   email,
    //   `Password Changed Successfully for ${process.env.PROJECT_NAME}`,
    //   emailTemplate.setNewPasswordSuccessfully()
    // );
    const sent = "t";
    if (!sent) {
      res.status(500).send({
        status: constant.ERROR,
        message: constant.PASSWORD_RESET_ERROR,
      });
    } else {
      res.status(200).send({
        status: constant.SUCCESS,
        message: constant.NEW_PASSWORD_SET_SUCCESS,
      });
    }
  } else {
    res.status(500).send({
      status: constant.SUCCESS,
      message: constant.REQUEST_EXPIRED,
    });
  }
});

const addUser = catchAsync(async (req, res) => {
  const data = req.body;
  data.status = "active";
  const userId = await incrementField("User", "userId", { role: "user" }, 9000);
  data.userId = userId;
  if (data.termsAndCondition) {
    data.acceptedAt = new Date();
  }
  let Record = await generalService.addRecord(TableName, data);

  res.send({
    status: constant.SUCCESS,
    message: constant.USER_REGISTER_SUCCESS,
    Record: _.pick(Record, [
      "_id",
      "firstName",
      "userId",
      "lastName",
      "email",
      "phoneNumber",
      "createdAt",
      "companyName",
      "companyNumber",
      "place",
      "country",
      "businessCustomer",
    ]),
  });
});

const editUser = catchAsync(async (req, res, next) => {
  const data = req.body;

  const Record = await generalService.findAndModifyRecord(
    TableName,
    { _id: data._id },
    data
  );

  let userRecord = await getUserRecord({ _id: Record._id });

  res.status(200).send({
    status: constant.SUCCESS,
    message: constant.PROFILE_UPDATE_SUCCESS,
    Record: userRecord[0],
  });
});

const updateStatus = catchAsync(async (req, res, next) => {
  const data = req.body;

  if (data.status === "block") {
    data.token = null;
  }

  const Record = await generalService.findAndModifyRecord(
    TableName,
    { _id: data._id },
    data
  );

  res.status(200).send({
    status: constant.SUCCESS,
    message: constant.PROFILE_UPDATE_SUCCESS,
    Record: _.pick(Record, [
      "_id",
      "firstName",
      "userId",
      "lastName",
      "status",
      "email",
    ]),
  });
});

const getProfile = catchAsync(async (req, res) => {
  const user = req.user;

  let aggregateArr = [
    { $match: { _id: user._id } },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        email: 1,
        phoneNumber: 1,
        companyName: 1,
        profileImageUrl: 1,
        userType: 1,
        companyNumber: 1,
        address: 1,
        postalCode: 1,
        place: 1,
        country: 1,
        newsLetter: 1,
        status: 1,
        role: 1,
        turnOffEmail: 1,
        profileCompleted: 1,
        newsLetter: 1,
        termsAndCondition: 1,
        favourites: 1,
        vatFee: 1,
        administrationFee: 1,
        businessCustomer: 1,
        customFee: 1,
      },
    },
  ];
  let Record = await generalService.getRecordAggregate(TableName, aggregateArr);

  res.send({
    status: constant.SUCCESS,
    message: "Record fetch Successfully",
    Record: Record[0],
  });
});

const getUsers = catchAsync(async (req, res) => {
  const data = JSON.parse(req.params.query);
  console.log("data", data);

  let condition = "";
  let searchCondition = "";

  if (data.name) {
    searchCondition = {
      $expr: {
        $regexMatch: {
          input: {
            $concat: [
              "$firstName",
              "$lastName",
              "$email",
              "$phoneNumber",
              { $toString: "$userId" },
            ],
          },
          regex: `.*${data.name}.*`, //Your text search here
          options: "i",
        },
      },
    };
  }

  condition = {
    status: data.status,
    role: "user",
  };

  if (data.query !== "all" && data.date && data.date.length > 0) {
    let startDate = new Date(new Date(data.date[0]).setHours(00, 00, 00));
    let endDate = new Date(new Date(data.date[1]).setHours(23, 59, 59));
    condition.createdAt = { $gte: startDate };
    condition.createdAt = { $lte: endDate };
  }
  let conditionSend = condition;
  if (searchCondition !== "") {
    conditionSend = {
      $and: [searchCondition, condition],
    };
  }

  let Record = await getUserRecord(conditionSend);

  res.send({
    status: constant.SUCCESS,
    message: "Record fetch Successfully",
    Record,
  });
});

const getCountriesList = catchAsync(async (req, res) => {
  const countries = countriesList;
  res.send({
    status: constant.SUCCESS,
    message: "Countries fetch Successfully",
    countries,
  });
});

const getUsersDropDown = catchAsync(async (req, res) => {
  let condition = "";

  condition = {
    status: "active",
    role: "user",
  };

  const aggregateArr = [
    { $match: condition },
    {
      $project: {
        userId: 1,
        companyName: 1,
        email: 1,
        name: { $concat: ["$firstName", " ", "$lastName"] },
        _id: 1,
      },
    },
  ];

  let Record = await generalService.getRecordAggregate(TableName, aggregateArr);

  res.send({
    status: constant.SUCCESS,
    message: "Record fetch Successfully",
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

const addFavourite = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;
  console.log(data);
  const Record = await generalService.findAndModifyRecord(
    TableName,
    { _id: user._id },
    { $push: { favourites: data.auctionId } }
  );
  //console.log(Record)
  res.send({
    status: constant.SUCCESS,
    message: "Add Favourite Successfully",
    Record,
  });
});

const removeFavourite = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;
  console.log(data);
  const Record = await generalService.findAndModifyRecord(
    TableName,
    { _id: user._id },
    { $pull: { favourites: data.auctionId } }
  );
  let userRecord = _.pick(Record, userFieldSendFrontEnd);
  //console.log(Record)
  res.send({
    status: constant.SUCCESS,
    message: "Remove Favourite Successfully",
    Record: userRecord,
  });
});

const getFavourite = catchAsync(async (req, res) => {
  const user = req.user;
  //console.log("==user==",user)
  const Record = await generalService.getRecord("Product", {
    _id: { $in: user.favourites },
  });
  //console.log(Record)
  res.send({
    status: constant.SUCCESS,
    message: "Fetch Favourite Successfully",
    Record,
  });
});

module.exports = {
  signUp,
  addUser,
  signIn,
  editUser,
  updateStatus,
  updateProfile,
  getProfile,
  resetPassword,
  forgetPassword,
  setNewPassword,
  changePassword,
  getUsers,
  getCountriesList,
  getUsersDropDown,
  deleteRecord,
  addFavourite,
  removeFavourite,
  getFavourite,
  checkUser,
};
