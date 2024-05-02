const mongoose = require("mongoose");
const constant = require("../utils/constant");
const generalService = require("../services/generalOperation");
const _ = require("lodash");

const authenticate = (req, res, next) => {
  const token = req.header("authorization");
  const User = mongoose.model("User");
  User.findByToken(token)
    .then(async (user) => {
      if (!user) {
        return Promise.reject();
      }

      let userObj = _.pick(user, [
        "_id",
        "email",
        "fullName",
        "firstName",
        "lastName",
        "phoneNumber",
        "role",
        "token",
        "optCodeSend",
        "lastApiRequest",
        "favourites",
      ]);

      req.user = userObj;
      req.token = token;
      next();
    })
    .catch((e) => {
      res.status(401).send({
        status: constant.ERROR,
        message: "Unauthorized User",
      });
    });
};
const isAdmin = (req, res, next) => {
  try {
    const user = req.user;
    const currentDate = new Date();
    const User = mongoose.model("User");
    const userLastApiRequest = new Date(user.lastApiRequest);
    const diffMilliseconds = currentDate - userLastApiRequest;
    const diffMinutes = diffMilliseconds / (1000 * 60);
    console.log("===== lastApiRequest =====", diffMilliseconds / (1000 * 60), diffMinutes < 30);

    if (user.role === "superAdmin") {
      if (diffMinutes < 30) {
        console.log("==== true =====");
        User.updateLastRequest(user._id);
        next();
      } else {
        res.status(401).send({
          status: constant.ERROR,
          message: "You Session time is end. kindly re-login and continue",
        });
      }
    } else {
      throw Error;
    }
  } catch (error) {
    res.status(403).send({
      status: constant.ERROR,
      message: "You have not valid permission to perform this task.",
    });
  }
};

module.exports = { authenticate, isAdmin };
