let mongoose = require('mongoose');
let mongooseStringQuery = require("mongoose-string-query");
let timestamps = require('mongoose-timestamp');
let objectID = require("mongoose").Schema.ObjectId;


const CitySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        minlength: 1,
        required: true
    }
});

CitySchema.plugin(timestamps);
CitySchema.plugin(mongooseStringQuery);
module.exports = mongoose.model('City', CitySchema);