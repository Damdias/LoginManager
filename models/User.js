
let mongoose = require('mongoose');
let mongooseStringQuery = require("mongoose-string-query");
let timestamps = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema({
    userName:{
        type:String,
        required: true,
        trim:true
    },
    email:{
        type:String,
        required:true,
    },
    firstName:{
        type: String,
        trim:true
    },
    lastName:{
        type: String,
        trim:true
    },
    phoneNo:{
        type: String
    },
    UserType:{
        type: String,
        required:true
    },
    isApproved:{
        type:boolean
    },
    "password":{
        type:String,
        required:true,
    }
});
UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);
module.exports = mongoose.model('User',UserSchema);