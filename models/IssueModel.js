let mongoose = require('mongoose');
let mongooseStringQuery = require("mongoose-string-query");
let timestamps = require('mongoose-timestamp');
let ObjectID = require("mongoose").Schema.ObjectID;

const IssueSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        trim: true,
        minlength: 1,
        required: true
    },
    description: {
        type: String
    },
    branchId:{
        type:ObjectID,
        required:true
    },
    branchName:{
        type:ObjectID,
        required:true
    },
    CreatedId:{
        type:ObjectID,
        required:true
    },
    CreatedByName:{
        type:ObjectID,
        required:true
    },
    AssignToUserId:{
        type:ObjectID,
        required:true
    },
    AssignToUserName:{
        type:ObjectID,
        required:true
    },
    images:{
        type:Array
    },
    Status:{
        type: String,
        required:true
    }

});

IssueSchema.plugin(timestamps);
IssueSchema.plugin(mongooseStringQuery);
module.exports = mongoose.model('Issue', IssueSchema);