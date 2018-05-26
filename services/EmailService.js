const nodemailer = require("nodemailer");

const configs = require("../config");
const tokenService = require("./TokenService");
const emailTemplate = require("../utils/UserEmailTemplate");

let emailConfigs = configs.email;

class EmailService {
    constructor() {
        this.LoginType = "login";
        this.transporter = null;
        this.InitTransport();
    }

    InitTransport() {
        this.transporter = nodemailer.createTransport({
            port: emailConfigs.port,
            host: emailConfigs.host,
            secure: false,
            auth: {
                type: this.LoginType,
                user: emailConfigs.user,
                pass: emailConfigs.pass
            }
        });
    }
    Verify(done) {
        this.transporter.verify((err, success) => {
            done(err, success);
        });
    }
    Send(mailOption, done) {
        mailOption["from"] = `PN Team <${emailConfigs.user}`;
        this.transporter.sendMail(mailOption, (err, info) => {
            console.log("send email error ", err);
            console.log("send email info ", info);
            done(err, info);
        });

    }
    SendEmailVerificationEmail(user) {
        let token = tokenService.EmailVeryToken(user._id);
        this.Send(emailTemplate.singupEmail(user.email, token),(err,info)=>{
            console.log("err", err);
            console.log('info ',info);
        });

    }
}

module.exports = new EmailService();
