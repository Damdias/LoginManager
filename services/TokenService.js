const jwt = require("jsonwebtoken");
const EmailSecret = 'email123'
module.exports.EmailVeryToken = (userId) => {
    let token = jwt.sign({ _id: userId }, EmailSecret);
    return token;
}
module.exports.ValidateEmailVeryToken = (token) => {
    return new Promise((resolve, reject) => {
        try {
            token = jwt.verify(token, EmailSecret);
            resolve(token);
        }
        catch (e) {
            console.log(e);
            reject();
        }

    });
}