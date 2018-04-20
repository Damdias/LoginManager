let mongoose = require('mongoose');
let mongooseStringQuery = require("mongoose-string-query");
let timestamps = require('mongoose-timestamp');
let objectID = require("mongoose").Schema.ObjectId;


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
        trim:true
    },
    address: {
        type: String,
        trim: true
    },
    supervior:{
        type:objectID
    }
});

BranchSchema.plugin(timestamps);
BranchSchema.plugin(mongooseStringQuery);
module.exports = mongoose.model('Branch', BranchSchema);