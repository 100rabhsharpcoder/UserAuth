const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/users");

// Authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      try {
        // Find a user and establish the identity
        const user = await User.findOne({ email: email });

        if (!user) {
          console.log("Invalid Username/Password");
          return done(null, false);
        }

        const isPasswordValid = await User.validPassword(password, user.password);

        if (!isPasswordValid) {
          console.log("Invalid Username/Password");
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        console.log("Error in finding user --> Passport");
        return done(error);
      }
    }
  )
);

// Serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);

    if (!user) {
      console.log("Error in finding user --> Passport");
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    console.log("Error in finding user --> Passport");
    return done(error);
  }
});

// Check if user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // If the user is signed in, then pass the request to the next function (controllers-action)
  if (req.isAuthenticated()) {
    return next();
  }

  // If the user is not signed in, then redirect to the sign-in page
  return res.redirect("/users/sign-in");
};

// Set the authenticated user
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the currently signed-in user from the session cookie
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
