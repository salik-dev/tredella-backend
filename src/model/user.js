"use strict";
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = process.env.SECRET_KEY;

const User = new mongoose.Schema(
  {
    userId: {
      type: Number,
      default: 0,
    },

    firstName: {
      type: String,
      lowercase: true,
    },

    lastName: {
      type: String,
      lowercase: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    verifyPhoneNumber: {
      type: Boolean,
      default: false,
    },

    phoneNumber: {
      type: String,
      unique: true,
      required: "phoneNumber is required",
    },

    otpCode: {
      type: String,
    },
    verifyOtp: {
      type: Boolean,
      default: false,
    },

    optCodeSend: {
      type: Number,
      default: 0,
    },

    businessCustomer: {
      type: Boolean,
      default: false,
    },
    companyName: {
      type: String,
    },

    companyNumber: {
      type: String,
    },

    address: {
      type: String,
    },

    address2: {
      type: String,
    },

    postalCode: {
      type: Number,
    },
    accountNumber: {
      type: Number,
    },

    place: {
      type: String,
    },

    country: {
      type: String,
    },

    newsLetter: {
      type: Boolean,
      default: false,
    },

    termsAndCondition: {
      type: Boolean,
      default: false,
    },

    plateForm: {
      type: String,
      enum: ["app", "google"],
      default: "app",
    },

    forgetPasswordAuthToken: {
      type: String,
    },

    password: {
      type: String,
    },

    status: {
      type: String,
      enum: ["unVerified", "active", "block"],
      default: "unVerified",
    },

    role: {
      type: String,
      enum: ["user", "superAdmin"],
      default: "user",
    },
    administrationFee: {
      type: Array,
    },
    vatFee: {
      type: Array,
    },
    customFee: {
      type: Boolean,
      default: false,
    },
    turnOffEmail: {
      type: Boolean,
      default: false,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
    profileImageUrl: {
      type: String,
    },

    acceptedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastApiRequest: {
      type: Date,
      default: Date.now,
    },

    lastLogin: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auction",
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
        phoneNumber: user.phoneNumber,
      },
      secretKey,
      {
        expiresIn: "1d",
      }
    )
    .toString();
  user.token = token;
  user.lastLogin = new Date();

  return user.save().then(() => {
    return token;
  });
};
User.methods.generateAuthTokenWithOtp = async function (otp = "") {
  let user = this;
  let access = "auth";

  let token = jwt
    .sign(
      {
        _id: user._id.toHexString(),
        access,
        phoneNumber: user.phoneNumber,
      },
      secretKey,
      {
        expiresIn: "1d",
      }
    )
    .toString();
  if (otp !== "") {
    user.otpCode = otp;
  }
  user.token = token;
  user.lastLogin = new Date();
  user.lastApiRequest = new Date();
  return user.save().then(() => {
    return token;
  });
};

User.statics.updateLastRequest = async function (_id) {
  let User = this;
  let lastApiRequest = new Date();
  let doc = await User.findOneAndUpdate({ _id: _id }, { lastApiRequest: lastApiRequest });
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
