const User = require('../models/users');
const userMailer = require('../mailers/signin_mailers')
// controller action for profile 
// module.exports.profile = async (req, res) =>{
 
//     try {
//       const user = await User.findById(req.params.id).exec();
//       console.log("find error",req.params);
    
//       if (!user) {
//         console.log("User not found for profile  this line wkrinv");
//         return res.redirect("back");
//       }
      
//       return res.render("profile", {
//         user: user,
//         id: req.user.id
//       });
//     } catch (error) {
//       console.log("Error in finding the user for profile:", error);
      
//       return res.redirect("back");
//     }

//   };

module.exports.profile = async function(req, res){
  try{
      let user = await User.findById(req.params.id);
          return res.render('profile', {
            user: user,
            id: req.user.id
          });
  }catch(err){
      console.log("error in profile controller",err);
  }

}


  

// controller action for update
  module.exports.update = async  (req, res)=> {
    try {
      const user = await User.findById(req.params.id).exec();
      if (!user) {
        console.log("User not found");
  
        return res.redirect("/users/profile");
      }
  
      const isOldPasswordValid = User.validPassword(req.body.old, user.password);
  
      if (!isOldPasswordValid) {
        console.log("Your Old Password is Wrong");
        req.flash("error", "Your old Password is wrong");
        return res.redirect("back");
      }
  
      const newPassword = User.generateHash(req.body.new);
  
      await User.findByIdAndUpdate(req.params.id, { password: newPassword }).exec();
  
      req.flash("success", "Your Password is updated");
      console.log("password is updated");
  
      return res.redirect("back");
    } catch (error) {
      console.log("Error in updating the password:", error);
      // Handle the error and send an appropriate response to the client
      return res.redirect("/users/profile");
    }
  };
  

  // controller for creating new user
  module.exports.create = async (req, res)=> {
    // console.log(req.body);
  
    if (req.body.password != req.body.confirm_password) {
      return res.redirect("back");
    }
  
    try {
      const existingUser = await User.findOne({ email: req.body.email }).exec();
      if (existingUser) {
        // User already exists
        return res.redirect("/user/sign-up");
      }
  
      const name = req.body.name;
      const email = req.body.email;
      const password = User.generateHash(req.body.password);
  
      console.log(password);
  
      const newUser = await User.create({
        name: name,
        email: email,
        password: password,
      });
  
      return res.render("sign_in");
    } catch (error) {
      console.log("Error in creating the user:", error);
      
      return res.redirect("/user/sign-up");
    }
  };
  

   // controller action for sesison creation


   module.exports.createSession = async (req, res) => {
     req.flash('success', 'Logged in Successfully');
     const user = await User.findOne({ email: req.body.email }).exec();
      
      
   console.log("for user mail",user.email)
     userMailer.newUser(user.email); 
   
     return res.redirect('/');
   };
   

  // controller action for logout
  
  // module.exports.destroy =(req, res)=> {
  //   req.logout();
  
  //   req.flash("success", "You have logged out");
  
  //   return res.redirect("/users/sign-in");
  // };

  module.exports.destroy = function (req, res) {
    req.logout(req.user, err => {
      if(err) return ;
      res.redirect("/");
    });
    req.flash("success", "You have logged out");
    return res.redirect("/users/sign-in");
  };
  
  // controller action for signup
  module.exports.sign_up =(req, res)=> {
    // if (req.isAuthenticated()){
    //   return  res.redirect('/users/profile')
    // }
    return res.render("sign_up");
  };
   
  // controller action for signin
  module.exports.sign_in =(req, res)=> {
    // if (req.isAuthenticated()){
    //  return res.redirect('/users/profile')
    // }
    return res.render("sign_in");
  };