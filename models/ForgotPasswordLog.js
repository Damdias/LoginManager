let mongoose = require('mongoose');
let mongooseStringQuery = require("mongoose-string-query");
let timestamps = require('mongoose-timestamp');
let validator = require("validator");
let jwt = require("jsonwebtoken");
let ObjectId = require("mongoose").Schema.ObjectId;

const ForgotPasswordSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true
    },
    token: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});
ForgotPasswordSchema.methods.createToken = function () {
    let forgot = this;
    
    let token = jwt.sign({ _id: forgot.userId }, 'fogot123');
    forgot.token = token;
    return forgot.save().then(() => {
        return token;
    });
   
}
ForgotPasswordSchema.plugin(timestamps);
ForgotPasswordSchema.plugin(mongooseStringQuery);
module.exports = mongoose.model('ForgotPasswordLog', ForgotPasswordSchema);