const passport = require("passport");
const mongoose = require("mongoose");
const { Strategy: LocalStrategy } = require("passport-local");
const User = mongoose.model("User");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy({ usernameField: "phoneNumber" }, (phoneNumber, password, done) => {
    const User = mongoose.model(`User`);
    console.log("===== phoneNumber", phoneNumber);
    User.findOne({ phoneNumber: phoneNumber }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { msg: `phoneNumber ${phoneNumber} not found.` });
      }
      user.comparePassword(password, async (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          // let token = await user.generateAuthToken();
          // user.token = token;
          return done(null, user);
        }
        return done(null, false, { msg: "Invalid phoneNumber or password." });
      });
      // return done(null, user);
    });
  })
);

/**
 * Sign in using Email and Password.
 */
passport.use(
  "local-user",
  new LocalStrategy({ usernameField: "phoneNumber" }, (phoneNumber, password, done) => {
    const User = mongoose.model(`User`);

    User.findOne({ phoneNumber: phoneNumber }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { msg: `PhoneNumber ${phoneNumber} not found.` });
      }

      user.comparePassword(password, async (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          let token = await user.generateAuthToken();
          user.token = token;
          return done(null, user);
        }
        return done(null, false, { msg: "Invalid phoneNumber or password." });
      });
    });
  })
);
