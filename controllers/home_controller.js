const User = require("../models/users");

module.exports.home = async (req, res) => {
    try {
      const users = await User.find().exec();
      return res.render("home", {
        Users: users,
      });
    } catch (error) {
      console.log("Error in finding the User for home page:", error);
     
     return res.status(500).send("Internal Server Error");
    }
  };
  
