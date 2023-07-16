const passport = require("passport");
const socialAuthStrategy = require("passport-google-oauth20").Strategy;
const crypto = require("crypto");
const dotenv = require('dotenv');
const User = require("../models/users");

passport.use(
  new socialAuthStrategy(
    {
        clientID:"443386636363-kn2bk5rqe9ut9jntvstn59pg5m9pihm6.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL:"http://127.0.0.1:7100/users/auth/google/callback"
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const existingUser = await User.findOne({ email: profile.emails[0].value }).exec();
        if (existingUser) {
          return done(null, existingUser);
        } else {
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
          });
          return done(null, newUser);
        }
      } catch (error) {
        console.log("Error in google strategy:", error);
        return done(error);
      }
    }
  )
);

module.exports = passport;
