let mongoose = require('mongoose');
let mongooseStringQuery = require("mongoose-string-query");
let timestamps = require('mongoose-timestamp');
let validator = require("validator");
let jwt = require("jsonwebtoken");

const ForgotPasswordSchema = new mongoose.Schema({
    userId: {
        type: Object
    },
    token: {
        type: String
    },
    isActive: {
        type: Boolean
    }
});
ForgotPasswordSchema.methods.createToken = function(){
    let forgot = this;
    let token = jwt.sign({ _id: forgot.userId }, 'fogot123');

    forgot.token = token;
    return forgot.save().then(() => {
        return token;
    })
}
ForgotPasswordSchema.plugin(timestamps);
ForgotPasswordSchema.plugin(mongooseStringQuery);
module.exports = mongoose.model('ForgotPasswordLog', ForgotPasswordSchema);