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
            }).catch((err) => {
                res.status(400).send();
            })
        // user.save().then(() => {
        //     return user.generateAuthToken();a
        // }).then((token) => {
        //     res.header('x-auth', token);
        //     res.send(user);
        //     next();

        // }).catch((e) => {
        //     return next(new errors.InternalError(e.message));
        //     next();
        // });

    });
}
module.exports = accountRoutes;