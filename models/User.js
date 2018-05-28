
let mongoose = require('mongoose');
let mongooseStringQuery = require("mongoose-string-query");
let timestamps = require('mongoose-timestamp');
let validator = require("validator");
let jwt = require("jsonwebtoken");
const _ = require('lodash');
const bcrypt = require("bcryptjs");
let ObjectId = require("mongodb").ObjectID;
const SECRECT = 'dev123';

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    phoneNo: {
        type: String
    },
    userType: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean
    },
    isAcitve: {
        type: Boolean
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    "password": {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
});
UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email','userName']);
}
UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({ _id: user._id.toHexString(), access }, SECRECT);
    user.tokens = [{ access, token }];
    return user.save().then(() => {
        return token;
    })
}
UserSchema.statics.findByToken = function (token) {
    let user = this;
    let decoded;

    try {
        decoded = jwt.verify(token, SECRECT);
    }
    catch (e) {
        return Promise.reject();
    }
    return user.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

}
UserSchema.statics.findByCredentials = function (email, password) {
    let user = this;
    return user.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        if (!user.isAcitve) {
            return Promise.reject("user is not active");
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                }
                else {
                    reject();
                }
            })
        })
    })
}
UserSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified("password")) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});
UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);
module.exports = mongoose.model('User', UserSchema);