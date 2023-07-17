const User = require('../models/users');
const Reset = require('../models/reset_password');
const bcrypt = require('bcrypt');
const userMailer = require('../mailers/signin_mailers');
const passwordMailer = require('../mailers/password_reset_mailer');



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
    const email= req.body.email;
     req.flash('success', 'Logged in Successfully');
     const user = await User.findOne({ email: req.body.email }).exec();
    console.log("finding user email",email);
      
       userMailer.newUser(email); 
   
     return res.redirect('/');
   };
   

  // controller action for logout
  
 
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
    if (req.isAuthenticated()){
      return  res.redirect('/users/profile')
    }
    return res.render("sign_up");
  };
   
  // controller action for signin
  module.exports.sign_in =(req, res)=> {
    if (req.isAuthenticated()){
     return res.redirect('/users/profile')
    }
    return res.render("sign_in");
  };



  module.exports.forgotpassword = function(req,res){
    return res.render('forget_password',{
        title: "Codeial | Forgot Password"
    });
}

// controller for sending password reset link on mail
module.exports.forgotemail = async function(req, res){
  console.log('running')

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      let updatetoken = await Reset.findOne({ email: req.body.email });
      let randomNum = Math.round(Math.random() * 10000000);
      let mail = user.email;

      if (updatetoken) {
        updatetoken.accessToken = randomNum;
        updatetoken.expireIn = new Date().getTime() * 200 * 1000;
        await updatetoken.save();
        passwordMailer.newPasswordLink({ mail, randomNum });
        req.flash('success', 'Link sent to email');
        return res.redirect('/');
      } else {
        await Reset.create({
          email: req.body.email,
          accessToken: randomNum,
          expireIn: new Date().getTime() * 200 * 1000
        });
        passwordMailer.newPasswordLink({ mail, randomNum });
        req.flash('success', 'Link sent to email');
        return res.redirect('/');
      }
    } else {
      req.flash('error', 'Email id not found');
      return res.redirect('/');
    }
  } catch (err) {
    console.log(err);
  }
}

  // controller for password reset
module.exports.passpage = async function(req, res){
  try{
      let user = await User.findOne({email:req.query.email});
      if(user){
          let passcheck = await Reset.findOne({email:req.query.email});
          if(passcheck){
              if(passcheck.accessToken == req.query.token){
                  if(passcheck.expireIn - new Date().getTime() < 0){
                      req.flash('error', 'Token expired');
                      passcheck.remove();
                      res.redirect('/');
                  }else{
                      return res.render('createpassword',{
                          title: 'Create Password',
                          email: req.query.email
                      })
                  }
              }else{
                  req.flash('error', 'Invalid token');
                  res.redirect('/');
              }
          }
      }else{
          req.flash('error', 'Email id not found');
          return res.redirect('/');
      }

  }catch(err){
      console.log(err);
  }
}


// controller action for update new  hashed password 
module.exports.updatepassword = async function(req, res) {
  try {
    const granted = await Reset.findOne({ email: req.body.email });
    if (granted) {
      if (req.body.password !== req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/');
      }
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/');
      }
      
      // Encrypt the password
      const saltRounds = 9;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      user.password = hashedPassword;
      
      await user.save();

      await Reset.deleteOne({ email: req.body.email });

      req.flash('success', 'Password changed successfully');
      return res.redirect('/users/sign-in');
    } else {
      req.flash('error', 'No permission granted');
      return res.redirect('/');
    }
  } catch (err) {
    console.log(err);
  }
};

