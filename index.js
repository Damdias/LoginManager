
process.env.NODE_ENV = 'development';

if(process.env.NODE_ENV === 'production'){
    console.log("runign with production ");
    process.env.PORT = '3344';
    process.env.BASE_URL = `http://bdfmweb.s3-website-us-east-1.amazonaws.com`;
    process.env.MONGODB_URI = 'mongodb://ec2-35-168-135-173.compute-1.amazonaws.com:27017';
}
let config = require("./config");
let restify = require('restify');

let mongoose = require('mongoose');
let restifyPlugins = require('restify-plugins');
let routes = require("./routes/index");
const corsMiddleware = require('restify-cors-middleware');



const cors = corsMiddleware({
    preflightMaxAge: 5, 
    origins: ['http://bdfmweb.s3-website-us-east-1.amazonaws.com', 'http://localhost:3000',"*"],
    allowHeaders: ['API-Token','x-auth',"*"],
    exposeHeaders: ['API-Token-Expiry']
  })
  


const server = restify.createServer({
    name: config.name,
    version: config.version
});
server.get("/",(req,res,next)=>{
    res.send({"msg":"Server is working"});
    next();
})
server.pre(cors.preflight)
server.use(cors.actual)

//server.use(restify.plugins.acceptParser(server.acceptable));
//server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restify.plugins.bodyParser({ mapParams: false }));

server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());
//server.use(restifyPlugins.multipartBodyParser());


server.listen(config.port, () => {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db.uri, config.db.options);

    const db = mongoose.connection;

    db.on('error', (err) => {
        console.error(err);
        process.exit(1);
    });
    db.once('open', () => {
      console.log("open db connection ", config.db.uri);
        routes(server);
        console.log(`Server is listening on port ${config.port}`);
    });
});