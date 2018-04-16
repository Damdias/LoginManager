let mongoose = require('mongoose');
let mongooseStringQuery = require("mongoose-string-query");
let timestamps = require('mongoose-timestamp');


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
    }
});

IssueSchema.plugin(timestamps);
IssueSchema.plugin(mongooseStringQuery);
module.exports = mongoose.model('Issue', IssueSchema);