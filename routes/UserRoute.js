let errors = require("restify-errors");
let User = require("../models/User");
let _ = require("lodash");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const emailService = require("../services/EmailService");
let userRoutes = (server) => {
    server.post('/Users', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'applicaiton/json'")
            );
        }

        let user = new User(_.pick(req.body, ["userName", 'email', 'firstName', 'lastName', 'phoneNo', 'userType', 'password']));
        user.isAcitve = false;
        user.isApproved = false;
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
            res.send(users);
            next();
        }).catch((err) => {
            return next(new errors.InternalError(err));
        })

    });
}
module.exports = userRoutes;