// JWT Import
const jwt = require("jsonwebtoken");
const User = require("../updateModel/allUsers");

const catchAsync = require("../utils/catchAsync");
const constant = require("../updateUtils/constant");
const {
  addRecord,
  getRecordAndSort,
  findAndModifyRecord,
  removeRecord,
} = require("../updateServices/commonOperation");
const modelName = "allUser";

const signToken = (id) => {
    return jwt.sign({ id}, process.env.SECRETE_STRING, {
        expiresIn: process.env.LOGIN_EXPIRES_IN,
      });
}

const signUp = catchAsync(async (req, res) => {
  const { fullName, userName, email, phoneNumber, password, platForm, status } =
    req.body;
  const role = "buyer";
  // Need to implement Global Validation Utils ==> pending
  const User = await addRecord(modelName, {
    fullName,
    userName,
    email,
    phoneNumber,
    password,
    platForm,
    status,
    role,
  });
  let token = null;
  if (User) {
    token = signToken(User?._id);
  } else {
    return res.status(500).json({
      message: "Something Went Wrong Try Again!",
      Record: null,
    });
  }
  return res.status(constant.STATUS_OK).json({
    message: constant.USER_REGISTER_SUCCESS,
    token,
    Record: User,
  });
});

const signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(500).json({
      message: "Provide a valid Email or Password",
    });
  }
  
  const user = await User.findOne({email}).select("+password");
  console.log('user', user);
  if(!user || !(await user.comparePassword(password, user.password))){
    return res.status(500).json({
        message: "Incorrect email or password"
    })
  }
  const token = signToken(user?._id);
  return res.status(200).json({
    message: "User Successfully Login",
    token,
    Record: user
  })
});

module.exports = {
  signUp,
  signIn,
};
