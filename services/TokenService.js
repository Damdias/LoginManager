const jwt = require("jsonwebtoken");
const EmailSecret = 'email123'
module.exports.EmailVeryToken = (userId) => {
    let token = jwt.sign({ _id: userId }, EmailSecret);
    return token;
}
module.exports.ValidateEmailVeryToken = (token) => {
    return new Promise((resolve, reject) => {
        console.log('verify');
        try {
            token = jwt.verify(token, EmailSecret);
            console.log('tokenv', token);
            resolve(token);
        }
        catch (e) {
            console.log(e);
            reject();
        }

    });
}