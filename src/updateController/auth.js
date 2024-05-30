// JWT Import
const jwt = require("jsonwebtoken");
const util = require("util");
const User = require("../updateModel/allUsers");
const catchAsync = require("../updateUtils/catchAsync");
const constant = require("../updateUtils/constant");
const { addRecord } = require("../updateServices/commonOperation");
const modelName = "allUser";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRETE_STRING, {
    expiresIn: process.env.LOGIN_EXPIRES_IN,
  });
};

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

  const user = await User.findOne({ email }).select("+password");
  console.log("user", user);
  if (!user || !(await user.comparePassword(password, user.password))) {
    return res.status(500).json({
      message: "Incorrect email or password",
    });
  }
  const token = signToken(user?._id);
  return res.status(200).json({
    message: "User Successfully Login",
    token,
    Record: user,
  });
});

const protect = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith("bearer")) {
    token = token.split(" ")[1];
  }
  if (!token) {
    next(new Error("You are not logged in !", 401));
  }
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRETE_STRING
  );
  const {id} = decodedToken
  console.log('token', id);
  const user =await User.findById(decodedToken.id);
  if (!user) {
    return next(new Error("The user with current token does'nt exist", 401));
  }
  console.log('user', user);
  req.user = user;
  next();
});

module.exports = {
  signUp,
  signIn,
  protect,
};
