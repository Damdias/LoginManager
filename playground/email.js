

 let emailclient =require("../services/EmailService");
 const tokenService = require("../services/TokenService");

 let emailtemplate = require("../utils/UserEmailTemplate");
 let getMailBody = (username, subject, message)=> {

    let mailOptins = {
        to: username,
        subject: subject,
        text: '',
        html: message
    };
    return mailOptins;
}

 let token = tokenService.EmailVeryToken("12");
emailclient.SendEmailVerificationEmail({_id:1,email:'damithasanka@gmail.com'});


console.log("message send success");