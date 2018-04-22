const config = require("../config");
module.exports.singupEmail = (username,token)=>{
    let tokenlink = `${config.base_url}/VerifyEmail?token=${token}`;
    let mailOptins = {
        to: username,
        subject: 'Welcome' ,
        text: '',
        html: `<div>
        Hi ${username}
            <h2>Please click blow link to verify email</h2>
        <a href="${tokenlink}"> verify email</a>`
    };
    return mailOptins;
}

let getMailBody = (username, subject, message)=> {

    let mailOptins = {
        to: username,
        subject: subject,
        text: '',
        html: message
    };
    return mailOptins;
}
