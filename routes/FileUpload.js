let errors = require("restify-errors");
let fs = require("fs");
let _ = require("lodash");
let AWS = require("aws-sdk");
var path = require("path");
let uuidv4 = require("uuid/v1");
let config = require("../config");
AWS.config.update({
    region: 'us-east-1'
});
let fileUploadRoute = (server) => {
    server.post('/file', (req, res, next) => {
        if (!req.files.hasOwnProperty("file")) {
            return send({ msg: "cannot find image" });
        }
        let params = {
            accessKeyId: config.aws.accessKeyId,
            secretAccessKey: config.aws.secretAccessKey,
            Bucket: config.aws.Bucket
        };
        let files = fs.readFileSync(req.files.file.path);
        let s3 = new AWS.S3(params);
        let filename = `${uuidv4()}${path.extname(req.files.file.name)}`;

        s3.upload({ Bucket: config.aws.Bucket, Body: files, Key: filename, ACL: "public-read" }, (err, data) => {
            if (err) {
                console.error("File upload error ", err)
                return res.send({ msg: "error occure", err });
            }
            res.send({ msg: 'file upload success', location: data.Location });

        });
    });

}

module.exports = fileUploadRoute;