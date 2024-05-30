"use strict";
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = process.env.SECRET_KEY;

const generateRandomOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const allUserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
    },
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
      select: false,
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
    },
    otp: {
      type: String,
      length: 6,
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

// Middleware to set OTP and otpExpiresAt before saving the document
allUserSchema.pre("save", async function (next) {
  if (!this.userId) {
    try {
      let prefix;
      switch (this.role) {
        case 'buyer':
          prefix = 's';
          break;
        case 'wholeSeller':
          prefix = 'ws-';
          break;
        case 'retailer':
        default:
          prefix = 'r';
          break;
      }
      // Find the highest userId with the same prefix
      let lastUser;
      let userIdNumber = 1;
      let foundUnique = false;

      while (!foundUnique) {
        const regex = new RegExp(`^${prefix}\\d+$`);
        lastUser = await this.constructor.findOne({ userId: `${prefix}${userIdNumber}` });

        if (lastUser) {
          userIdNumber++;
        } else {
          this.userId = `${prefix}${userIdNumber}`;
          foundUnique = true;
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

// Middleware to add otp
allUserSchema.pre("save", function( next) {
  if (this.isModified("otp") || !this.otp) {
    this.otp = generateRandomOTP();
  }
  next();
});

allUserSchema.statics.updateLastRequest = async function (_id) {
  let buyer = this;
  let lastApiRequest = new Date();
  let doc = await buyer.findOneAndUpdate(
    { _id: _id },
    { lastApiRequest: lastApiRequest }
  );
  return doc;
};

//===================== Password hash middleware =================//
allUserSchema.pre("save", function save(next) {
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
allUserSchema.methods.comparePassword = async function (reqPwd, DBPwd){
  return await bcrypt.compare(reqPwd, DBPwd);
}

allUserSchema.statics.findByToken = function (token) {
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

const allUser = mongoose.model("allUser", allUserSchema);
module.exports = allUser;
