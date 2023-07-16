const dotenv =require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
// importing db 
const db = require("./config/mongoose");
// importing express sesison
const session = require("express-session");
// importing passport 
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");

const passportGoogle = require("./config/passport-google-oauth2-stratgey");
const flash = require("connect-flash");

const custemMiddleware = require("./config/middleware");
const MongoStore = require("connect-mongo");
const expressLayouts = require("express-ejs-layouts");

const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(express.urlencoded());

app.use(express.static("./assets"));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.set("view engine", "ejs");

app.set("views", "./views");

app.use(session({
  name: 'codeial',
  // TODO: Change the secret before deployment
  secret: process.env.jwt_secret,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge:(100 * 60 * 100),
  },
  store: MongoStore.create(
      {
          mongoUrl:'mongodb://127.0.0.1:27017/codeial_development',
          autoRemove:'disabled'
      },
      
   function(err) {
    console.log(err || 'connect-mongo db Setup ok');
  }),
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(custemMiddleware.setFlash);

app.use("/", require("./routes"));


app.listen(process.env.PORT, function (err) {
    if (err) {
      console.log("Server is not getting fired ");
  
      return;
    }
  
    console.log("server is running at the port", process.env.PORT);
  });
