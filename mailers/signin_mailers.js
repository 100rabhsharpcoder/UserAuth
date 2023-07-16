const nodeMailer = require("../config/nodemailer");

// this is another way of exporting a method
exports.newUser = (email) => {
  // console.log( " reciever mail",email);
  console.log("inside newComment mailer");

  nodeMailer.transporter.sendMail(
    {
      from: "saurabhgathade@gmail.com",
      to: email,
      subject: "User Logged in",
      html: "<h1>Yup, You have Successfully logged in</h1>",
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
