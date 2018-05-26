let AWS = require("aws-sdk");
let fs = require("fs");
var path = require("path");

AWS.config.update({
    region:'us-east-1',
    // accessKeyId:"AKIAJWPDJZHSESJZMH2Q",
    // secretAccessKey:"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",
//     credentials:{secretAccessKey:"Py/RdeyCqorTAkY9T2huwZzFHLcVi4krNJBH9AcU",
// accessKeyId :"AKIAJWPDJZHSESJZMH2Q"}

});

let s3 = new AWS.S3({accessKeyId:"AKIAJWPDJZHSESJZMH2Q",secretAccessKey:"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",Bucket:'bsfm-files/isssueImages'});
//let data = fs.readFileSync("./playground/file.txt","buffer");

//s3.upload({Bucket:"isssueImages",Body:fle})
let files = fs.readFileSync("./playground/rawana.jpg");
let fileanme = path.basename("./playground/rawana.jpg");
//files.toString()
s3.upload({Bucket:'bsfm-files/isssueImages',Body:files,Key:fileanme,ACL:"public-read"},(err,data)=>{
   if(err){
    console.log(err);
   }  
console.log("success ",data);

})
console.log("read");