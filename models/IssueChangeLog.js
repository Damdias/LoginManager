let mongoose = require('mongoose');
let mongooseStringQuery = require("mongoose-string-query");
let timestamps = require('mongoose-timestamp');
let ObjectId = require("mongoose").Schema.ObjectId;


const IssueChangeLogSchema = new mongoose.Schema({
    IssueID: {
        type: ObjectId,
        required: true
    },
    OldStatus: {
        type: String,
        required:true,
        trim:true
    },
    NewStatus:{
        type:String,
        required:true,
        trim:true
    },
    ChangedBy:{
        type:ObjectId,
        required:true
    }
});

IssueChangeLogSchema.plugin(timestamps);
IssueChangeLogSchema.plugin(mongooseStringQuery);
module.exports = mongoose.model('IssueChangeLog', IssueChangeLogSchema);