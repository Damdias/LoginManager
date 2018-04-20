const errors = require("restify-errors");
const User = require("../models/User");

const Auth = (req, res, next) => {
        let authtoken = req.header("x-auth");
        if (typeof authtoken === "undefined") {
                res.status(400);
                return res.send(new errors.InternalError("can't find x-auth token"));
        }
        User.findByToken(authtoken).then((user) => {
                console.log("valid token");
                next();
        }).catch((e) => {
                res.status(400);
                return res.send({ "msg": "Invalid token" });
        });

}

module.exports = Auth;