const nodeMailer = require('../config/nodemailer');

exports.newPasswordLink = (params)=>{
    let htmlString = nodeMailer.renderTemplate({email: params.mail , token: params.randomNum} , '/comments/new_password.ejs');
    nodeMailer.transporter.sendMail({
        from: 'saurabhgathade@gmail.com',
        to: params.mail, //comment.user.email
        subject: "Password Reset!",
        html: htmlString
    }, (err, info)=>{
        if(err){
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message sent');
        return;
    })
}
