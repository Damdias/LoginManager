const errors = require("restify-errors");
const User = require("../models/User");

const Auth = (req, res, next) => {
        let authtoken = req.header("x-auth");
        if (typeof authtoken === "undefined") {
                res.status(400);
                return res.send(new errors.InternalError("can't find x-auth token"));
        }
        User.findByToken(authtoken).then((user) => {
                req.body.authUser = user;
               next();
        }).catch((e) => {
                console.log('Auth middleware error',e);
                res.status(400);
                return res.send({ "msg": "Invalid token",err:e });
        });

}

module.exports = Auth;