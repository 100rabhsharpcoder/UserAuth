const mongoose = require("mongoose");
const dotenv =require('dotenv');

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Your server successfully connected to MONGODb");
});

module.exports = db;