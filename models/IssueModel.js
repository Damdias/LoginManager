let mongoose = require('mongoose');
let mongooseStringQuery = require("mongoose-string-query");
let timestamps = require('mongoose-timestamp');
let ObjectID = require("mongoose").Schema.ObjectID;

const IssueSchema = new mongoose.Schema({
    IssueName: {
        type: String,
        unique: true,
        trim: true,
        minlength: 1,
        required: true
    },
    
    Description: {
        type: String
    },
    Branch:{
        type:ObjectID,
        required:true
    },
    CreatedBy:{
        type:ObjectID,
        required:true
    },
    Status:{
        type: String,
        required:true
    }

});

IssueSchema.plugin(timestamps);
IssueSchema.plugin(mongooseStringQuery);
module.exports = mongoose.model('Issue', IssueSchema);