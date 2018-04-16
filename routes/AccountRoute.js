
let errors = require("restify-errors");
let User = require("../models/User");
let ForgotLog = require("../models/ForgotPasswordLog");
let jwt = require("jsonwebtoken");
let ObjectId = require("mongodb").ObjectID;

let _ = require("lodash");

let accountRoutes = (server) => {
    server.post('/Login', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'applicaiton/json'")
            );
        }

        let body = _.pick(req.body, ["userName", 'password']);


        User.findByCredentials(body.userName, body.password)
            .then((user) => {
                res.send(user);
                next();
            }).catch((err) => {
                res.status(400);
                res.send({ "msg": "Invalid credentials", "err": err });
                next();
            });

    });

    server.put('/Forgot', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'applicaiton/json'")
            );
        }

        let body = _.pick(req.body, ["email"]);


        User.findOne({ email: body.email }).then((user) => {
            if (!user) {
                return next(new errors.InvalidArgumentError("Invalid user Name"))
            }
            let forgotlog = new ForgotLog({
                userId: user._id,
                isActive: true
            });
            forgotlog.save().then(() => {
                forgotlog.createToken();
                console.log("save forgot log token is ", forgotlog.token);
            })
            user.isAcitve = false;
            user.save();
            res.send(user);
            next();


        }).catch((e) => {
            return next(
                new errors.InternalError(e.message)
            );
        })
    });
    server.put('/Approve', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'applicaiton/json'")
            );
        }

        let body = _.pick(req.body, ["email"]);


        User.findOne({ email: body.email }).then((user) => {
            if (!user) {
                return next(new errors.InvalidArgumentError("Invalid user Name"))
            }

            user.isAcitve = true;
            user.isApproved = true;
            user.save();
            res.send(user);
            next();


        }).catch((e) => {
            return next(
                new errors.InternalError(e.message)
            );
        })
    });
    server.put('/Reset', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'applicaiton/json'")
            );
        }
       
        let token = null;
        try {
             token = jwt.verify(req.query.token, 'fogot123');
        }
        catch (e) {
            res.status(400);
            res.send({ msg: 'Invalid token' });
            next();
        }
        
        let body = _.pick(req.body, ["email", "password"]);

        ForgotLog.findOne({ userId: ObjectId(token._id), isActive:true }).then((log) => {
            if (!log) {
                return next(new errors.InternalServerError("Request token is not valid token"));
            }
            log.isActive = false;
            log.save();
            User.findOne({ email: body.email }).then((user) => {
                if (!user) {
                    return next(new errors.InvalidArgumentError("Invalid user Name"))
                }

                user.isAcitve = true;
                user.password = body.password;

                user.save().then(() => {
                    user.generateAuthToken();
                    res.send(user);
                    next();
                })
                    .catch((err) => {
                        return new errors.InvalidArgumentError(err);
                    })

            }).catch((e) => {
                return next(
                    new errors.InternalError(e.message)
                );
            })
        }).catch((err) => {
            res.status(400);
            res.send({
                msg: err
            });
        })

    });
}
module.exports = accountRoutes;