
let errors = require("restify-errors");
let User = require("../models/User");
let ForgotLog = require("../models/ForgotPasswordLog");
let jwt = require("jsonwebtoken");
let ObjectId = require("mongodb").ObjectID;
let _ = require("lodash");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const tokenService = require("../services/TokenService");
const emailService = require("../services/EmailService");

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
                if (!user.isEmailVerified) {
                    res.status(400);
                    res.send({ msg: 'Please veryfly email ' });
                   return next();
                }
                if (user.isApproved && user.isAcitve) {
                    user.generateAuthToken()
                    res.send({ "token": user.tokens[0].token, user });
                   return next();
                }
                else {
                    res.status(400);
                    if (!user.isApproved) {
                        res.send({ "msg": "User is not Approved" });
                    }
                    else {
                        res.send({ "msg": "User is not active" });
                    }
                    return next();

                }
            }).catch((err) => {
                res.status(400);
                res.send({ "msg": "Invalid credentials", "err": err });
               return next();
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
    server.put('/Approve', AuthMiddleware, (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'applicaiton/json'")
            );
        }

        let body = _.pick(req.body, ["email"]);
        if(req.body.authUser.userType !== "Supervisor"){
                res.status(400);
                res.send({msg:'User do not have required permission'});
                next();
                return;
        }

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
    server.put('/activate', AuthMiddleware, (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'applicaiton/json'")
            );
        }

        let body = _.pick(req.body, ["id","active"]);
        if(req.body.authUser.userType !== "Supervisor"){
                res.status(400);
                res.send({msg:'User do not have required permission'});
                next();
                return;
        }

        User.findOne({ _id: body.id }).then((user) => {
            if (!user) {
                return next(new errors.InvalidArgumentError("Can't find user"))
            }

            user.isAcitve = body.active;
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

        ForgotLog.findOne({ userId: ObjectId(token._id), isActive: true }).then((log) => {
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
            res.send({ msg: err });
        })

    });
    server.get('/VerifyEmail', (req, res, next) => {

        let body = _.pick(req.query, ["token"]);
        tokenService.ValidateEmailVeryToken(body.token).then((validtoken) => {
            User.findOne({ _id: ObjectId(validtoken._id) })
                .then((user) => {
                    user.isEmailVerified = true;
                    user.save();
                    res.send({ msg: 'email verification is successed' })
                    next();
                }).catch((err) => {
                    res.status(400);
                    res.send({ "msg": "Can't find user", "err": err });
                    next();
                });


        }).catch((e) => {
            console.log("error ", e);
            res.status(400);
            res.send({ msg: 'Invalid token' });
            next();
        })

    });
}
module.exports = accountRoutes;