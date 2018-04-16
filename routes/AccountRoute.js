
let errors = require("restify-errors");
let User = require("../models/User");
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
                res.send({ "msg": "Invalid credentials", "err":err  });
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

        let body = _.pick(req.body, ["email", "password"]);


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
    });
}
module.exports = accountRoutes;