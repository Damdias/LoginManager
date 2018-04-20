// let restify = require('restify');
// let bunyan = require("bunyan");


// let respond = (req,res,next)=>{
//     res.send('hello '+req.params.name);
//     next();
// }

// const server = restify.createServer({
//     log:bunyan.createLogger({
//         name:'myapp'
//     })
// });
// server.get('/hello/:name',respond);
// server.head('/hello/:name',respond);

// server.listen(8080,()=>{
//     console.log('%s listening at %s', server.name,server.url);
// })

let config = require("./config");
let restify = require('restify');

let mongoose = require('mongoose');
let restifyPlugins = require('restify-plugins');
let routes = require("./routes/index");

const server = restify.createServer({
    name: config.name,
    version: config.version
});
server.get("/",(req,res,next)=>{
    res.send({"msg":"Server is working"});
    next();
})
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());


server.listen(config.port, () => {
    // mongoose.Promise = global.Promise;
    // mongoose.connect(config.db.uri, config.db.options);

    // const db = mongoose.connection;

    // db.on('error', (err) => {
    //     console.error(err);
    //     process.exit(1);
    // });
    // db.once('open', () => {
    //     routes(server);
    //     console.log(`Server is listening on port ${config.port}`);
    // });
});