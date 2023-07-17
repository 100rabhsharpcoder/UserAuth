// signinmailer 
const nodeMailer = require("../config/nodemailer");

// this is another way of exporting a method
exports.newUser = (email) => {
  console.log("inside newComment mailer");

  nodeMailer.transporter.sendMail(
    {
      from: "saurabhgathade@gmail.com",
      to: email,
      subject: "Log in Notification",
      html: "<h1>Yup, You have Successfully logged in </h1>",
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }

      return;
    }
  );
};


