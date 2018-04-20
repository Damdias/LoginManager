let mongoose = require('mongoose');
let mongooseStringQuery = require("mongoose-string-query");
let timestamps = require('mongoose-timestamp');


const IssueTypeSchema = new mongoose.Schema({
    IssueName: {
        type: String,
        unique: true,
        trim: true,
        minlength: 1,
        required: true
    },
    
    Description: {
        type: String
    }
});

IssueTypeSchema.plugin(timestamps);
IssueTypeSchema.plugin(mongooseStringQuery);
module.exports = mongoose.model('IssueTypes', IssueTypeSchema);