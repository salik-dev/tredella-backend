"use strict";
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = process.env.SECRET_KEY;

const buyerSchema = new mongoose.Schema(
  {
    // userId: {
    //   type: String, // Need to be confirmation
    // },
    fullName: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    userName: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "password is required"],
    },

    plateForm: {
      type: String,
      enum: ["app", "google", "website", "portal"],
      default: "portal",
    },
    status: {
      type: String,
      enum: ["pending", "active", "block"],
      default: "pending",
    },
    role: {
      type: String,
      enum: ["buyer", "retailer", "wholeSeller", "superAdmin", "admin"],
      default: "buyer",
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

buyerSchema.methods.generateAuthToken = async function (extra = "") {
  let user = this;
  let access = "auth";

  let token = jwt
    .sign(
      {
        _id: user._id.toHexString(),
        access,
        email: user.email,
      },
      secretKey
    )
    .toString();
  user.token = token;
  user.lastLogin = new Date();

  return user.save().then(() => {
    return token;
  });
};

buyerSchema.statics.updateLastRequest = async function (_id) {
  let buyer = this;
  let lastApiRequest = new Date();
  let doc = await buyer.findOneAndUpdate(
    { _id: _id },
    { lastApiRequest: lastApiRequest }
  );
  return doc;
};

//===================== Password hash middleware =================//
buyerSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

//===================== Helper method for validating user's password =================//
buyerSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  try {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      cb(err, isMatch);
    });
  } catch (error) {
    console.log("=========== Error in Comparing Password", error);
  }
};

buyerSchema.statics.findByToken = function (token) {
  let buyer = this;
  let decoded;

  try {
    decoded = jwt.verify(token, secretKey);
  } catch (error) {
    return Promise.reject(error);
  }

  return buyer.findOne({
    _id: decoded._id,
    token: token,
  });
};

const Buyer = mongoose.model("Buyer", buyerSchema);
module.exports = Buyer;