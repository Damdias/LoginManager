let errors = require("restify-errors");
let User = require("../models/User");

let routes = (server) => {
    server.post('/Users', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'applicaiton/json'")
            );
        }

        let user = new User(req.body);

        user.save((err) => {
            if (err) {
                console.err(err);
                return next(new errors.InternalError(err.message));
                next();
            }
            res.send(201);
            next();
        });

    });
}
module.exports = routes;