let mongoose = require('mongoose');
let mongooseStringQuery = require("mongoose-string-query");
let timestamps = require('mongoose-timestamp');


const BranchSchema = new mongoose.Schema({
    branchName: {
        type: String,
        unique: true,
        trim: true,
        minlength: 1,
        required: true
    },
    
    phoneNo: {
        type: String,
        minlength: 10,
    },
    address: {
        type: String,
        trim: true
    }
});

BranchSchema.plugin(timestamps);
BranchSchema.plugin(mongooseStringQuery);
module.exports = mongoose.model('Branch', BranchSchema);