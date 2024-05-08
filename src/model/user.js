"use strict";
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = process.env.SECRET_KEY;

const User = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    fullName: {
      type: String,
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
    address: {
      type: String,
    },
    postalCode: {
      type: Number,
    },
    place: {
      type: String,
    },
    country: {
      type: String,
    },
    plateForm: {
      type: String,
      enum: ["app", "google", "website", "portal"],
      default: "portal",
    },
    forgetPasswordAuthToken: {
      type: String,
    },
    password: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "block"],
      default: "active",
    },
    role: {
      type: String,
      enum: ["user", "retailer", "wholeSeller", "superAdmin", "admin"],
      default: "user",
    },
    token: {
      type: String,
    },
    profileImageUrl: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    duration: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    versionKey: false,
  }
);

User.methods.generateAuthToken = async function (extra = "") {
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

User.statics.updateLastRequest = async function (_id) {
  let User = this;
  let lastApiRequest = new Date();
  let doc = await User.findOneAndUpdate(
    { _id: _id },
    { lastApiRequest: lastApiRequest }
  );
  return doc;
};

//===================== Password hash middleware =================//
User.pre("save", function save(next) {
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
User.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  try {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      cb(err, isMatch);
    });
  } catch (error) {
    console.log("=========== Error in Comparing Password", error);
  }
};

User.statics.findByToken = function (token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, secretKey);
  } catch (error) {
    return Promise.reject(error);
  }

  return User.findOne({
    _id: decoded._id,
    token: token,
  });
};

mongoose.model("User", User);
