let mongoose = require('mongoose');
let mongooseStringQuery = require("mongoose-string-query");
let timestamps = require('mongoose-timestamp');
let objectID = require("mongoose").Schema.ObjectId;

const IssueSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 1,
        required: true
    },
    description: {
        type: String,
        trim: true,
        minlength: 1,
        required: true
    },
    branchId:{
        type:objectID,
        required:true
    },
    branchName:{
        type:String,
        required:true
    },
    CreatedId:{
        type:objectID,
        required:true
    },
    CreatedByName:{
        type:String,
        required:true
    },
    AssignToUserId:{
        type:objectID,
        required:true
    },
    AssignToUserName:{
        type:String,
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