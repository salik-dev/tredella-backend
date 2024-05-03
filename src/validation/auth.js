const joi = require("joi");
const { ERROR, VALIDATION_ERROR_MESSAGE } = require("../utils/constant");
const e164Pattern = /^\+\d{6,25}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

///==========================admin validations======================================
const signInAdmin = async (req, res, next) => {
  const data = req.body;

  const Schema = joi.object().keys({
    phoneNumber: joi.string().regex(e164Pattern).required(),
    password: joi.string().required(),
  });

  const { error } = Schema.validate(data);
  if (error) {
    console.log("==== error ====", error);
    res.status(404).send({ status: ERROR, message: VALIDATION_ERROR_MESSAGE });
    return;
  }
  next();
};

const addUser = async (req, res, next) => {
  const data = req.body;

  const Schema = joi
    .object()
    .keys({
      firstName: joi.string().required(),
      lastName: joi.string().required(),
      email: joi.string().regex(emailRegex).email().required(),
      phoneNumber: joi.string().regex(e164Pattern).required(),
    })
    .options({ allowUnknown: true });

  const { error } = Schema.validate(data, { allowUnknown: true });
  console.log("==== error ====", error);
  if (error) {
    const isValidationError = error.details.every(
      (detail) => detail.type === "any.required"
    );

    if (isValidationError) {
      res.status(400).send({
        status: "ERROR",
        message: "Validation error - required fields missing",
      });
      return;
    } else {
      res.status(400).send({
        status: "ERROR",
        message: "Validation error - invalid data",
        details: error.details,
      });
      return;
    }
  }
  next();
};

const editUser = async (req, res, next) => {
  const data = req.body;

  const Schema = joi
    .object()
    .keys({
      _id: joi.string().required(),
      phoneNumber: joi.string().regex(e164Pattern).required(),
    })
    .options({ allowUnknown: true });

  const { error } = Schema.validate(data, { allowUnknown: true });
  if (error) {
    const isValidationError = error.details.every(
      (detail) => detail.type === "any.required"
    );

    if (isValidationError) {
      res.status(400).send({
        status: "ERROR",
        message: "Validation error - required fields missing",
      });
      return;
    } else {
      res.status(400).send({
        status: "ERROR",
        message: "Validation error - invalid data",
        details: error.details,
      });
      return;
    }
  }
  next();
};

const updateStatus = async (req, res, next) => {
  const data = req.body;

  const Schema = joi.object().keys({
    _id: joi.string().required(),
    status: joi.string().required(),
  });

  const { error } = Schema.validate(data);
  if (error) {
    res.status(404).send({ status: ERROR, message: VALIDATION_ERROR_MESSAGE });
    return;
  }
  next();
};

const resetPassword = async (req, res, next) => {
  const data = req.body;

  const Schema = joi.object({
    _id: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required(),
  });
  const { error } = Schema.validate(data);
  if (error) {
    res.status(404).send({ status: ERROR, message: VALIDATION_ERROR_MESSAGE });
    return;
  }
  next();
};

///==========================user validations======================================

const logIn = async (req, res, next) => {
  const data = req.body;
  const Schema = joi.object().keys({
    email: joi.string().regex(emailRegex).required(),
    password: joi.string().required(),
  });

  const { error } = Schema.validate(data);
  if (error) {
    res.status(404).send({ status: ERROR, message: VALIDATION_ERROR_MESSAGE });
    return;
  }
  next();
};

const signUp = async (req, res, next) => {
  const data = req.body;

  const Schema = joi.object({
    phoneNumber: joi.string().regex(e164Pattern).required(),
    password: joi.string().required(),
  });
  const { error } = Schema.validate(data, { allowUnknown: true });
  if (error) {
    res.status(404).send({ status: ERROR, message: VALIDATION_ERROR_MESSAGE });
    return;
  }
  next();
};

const verifyOtp = async (req, res, next) => {
  const data = req.body;

  const Schema = joi.object({
    otpCode: joi.string().required(),
  });
  const { error } = Schema.validate(data);
  if (error) {
    res.status(404).send({ status: ERROR, message: VALIDATION_ERROR_MESSAGE });
    return;
  }
  next();
};

const forgetPassword = async (req, res, next) => {
  const data = req.body;

  const Schema = joi.object({
    email: joi.string().regex(emailRegex).email().required(),
  });
  const { error } = Schema.validate(data);
  if (error) {
    res.status(404).send({ status: ERROR, message: VALIDATION_ERROR_MESSAGE });
    return;
  }
  next();
};

const changePassword = async (req, res, next) => {
  const data = req.body;

  const Schema = joi.object({
    password: joi.string().required(),
    oldPassword: joi.string().required(),
  });
  const { error } = Schema.validate(data);
  if (error) {
    res.status(404).send({ status: ERROR, message: VALIDATION_ERROR_MESSAGE });
    return;
  }
  next();
};

const setNewPassword = async (req, res, next) => {
  const data = req.body;

  const Schema = joi.object({
    forgetPassAuthToken: joi.string().required(),
    password: joi.string().required(),
  });
  const { error } = Schema.validate(data);
  if (error) {
    res.status(404).send({ status: ERROR, message: VALIDATION_ERROR_MESSAGE });
    return;
  }
  next();
};

const updateProfile = async (req, res, next) => {
  const data = req.body;

  // Define a base schema with common validations
  const baseSchema = {
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string(),
    userType: joi.string().valid("personal", "business").default("personal"),
    role: joi.string().valid("user", "superAdmin").default("user"),
    companyName: joi.string(),
    companyNumber: joi.string(),
    address: joi.string(),
    address2: joi.string().optional(),
    postalCode: joi.number(),
    accountNumber: joi.number(),
    place: joi.string(),
    country: joi.string(),
    profileCompleted: joi.boolean(),
    phoneNumber: joi.number(),
    newsLetter: joi.boolean(),
    profileImageUrl: joi.string(),
    termsAndCondition: joi.boolean().required(),
    turnOffEmail: joi.boolean(),
  };
  const updateKeys = Object.keys(data).filter((key) => baseSchema[key]);

  const dynamicSchema = {};
  updateKeys.forEach((key) => {
    dynamicSchema[key] = baseSchema[key];
  });

  const schema = joi.object(dynamicSchema);

  const { error } = schema.validate(data);
  if (error) {
    res.status(400).send({ status: ERROR, message: error.message });
    return;
  }

  next();
};

module.exports = {
  //==================ADMIN MODULES===========
  signInAdmin,
  addUser,
  editUser,
  updateStatus,
  resetPassword,

  //===================USER MODULES===========

  signUp,
  verifyOtp,
  logIn,
  forgetPassword,
  changePassword,
  updateProfile,
  setNewPassword,
};
