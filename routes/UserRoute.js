let errors = require("restify-errors");
let User = require("../models/User");
let _ = require("lodash");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const emailService = require("../services/EmailService");
let userRoutes = (server) => {
    server.post('/Users', (req, res, next) => {

        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'")
            );
        }

        let user = new User(_.pick(req.body, ["userName", 'email', 'firstName', 'lastName', 'phoneNo', 'userType', 'password']));
        user.isAcitve = false;
        user.isApproved = false;
        user.password = user.password || '1234$'
        // user.save((err) => {
        //     if (err) {
        //         console.err(err);
        //         return next(new errors.InternalError(err.message));
        //         next();
        //     }
        //     res.send(201);
        //     next();
        // });
        user.save().then((user) => {
            // return user.generateAuthToken();
            //}).then((token) => {
            // res.header('x-auth', token);
            console.log("send mail");
            emailService.SendEmailVerificationEmail(user);
            res.status(201);
            res.send({ 'msg': 'User Created success' });
            next();

        }).catch((e) => {
            return next(new errors.InternalError(e.message));
            next();
        });

    });
    server.get('/Users', AuthMiddleware, (req, res, next) => {
        User.find().then((users) => {
            let newusers = users.map((u) => {
                return {
                    userName: u.userName,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    phoneNo: u.phoneNo,
                    email: u.email,
                    id: u._id,
                    userType: u.userType,
                    isApproved: u.isApproved,
                    isAcitve: u.isAcitve,
                    isEmailVerified: u.isEmailVerified
                }
            });
            res.send(newusers);
            next();
        }).catch((err) => {
            return next(new errors.InternalError(err));
        })

    });
    server.get('/Users/byType/:type', AuthMiddleware, (req, res, next) => {
        let paruserType = req.params.type;
        User.find({ $and: [{ userType: { $eq: paruserType } }, { isAcitve: { $exists: true } }] }).then((users) => {
            let newusers = users.map((u) => {
                return {
                    userName: u.userName,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    phoneNo: u.phoneNo,
                    email: u.email,
                    id: u._id,
                    userType: u.userType,
                    isApproved: u.isApproved,
                    isAcitve: u.isAcitve,
                    isEmailVerified: u.isEmailVerified
                }
            });
            res.send(newusers);
            next();
        }).catch((err) => {
            return next(new errors.InternalError(err));
        })

    });
    server.put('/Users', AuthMiddleware, (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'applicaiton/json'")
            );
        }

        let body = _.pick(req.body, ["id", "userType", "userName", "description", "phoneNo", "email"]);
        if (req.body.authUser.userType !== "Supervisor") {
            res.status(400);
            res.send({ msg: 'User do not have required permission' });
            next();
            return;
        }

        User.findOne({ _id: body.id }).then((user) => {
            if (!user) {
                return next(new errors.InvalidArgumentError("Can't find user"))
            }

            user.userName = body.userName;
            user.phoneNo = body.phoneNo;
            user.email = body.email;
            user.userType = body.userType;
            user.save();
            res.send(user);
            next();


        }).catch((e) => {
            return next(
                new errors.InternalError(e.message)
            );
        })
    });
}
module.exports = userRoutes;