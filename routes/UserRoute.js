let errors = require("restify-errors");
let User = require("../models/User");
let _ = require("lodash");

let userRoutes = (server) => {
    server.post('/Users', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'applicaiton/json'")
            );
        }

        let user = new User(_.pick(req.body,["userName",'email','firstName','lastName','phoneNo','userType','password']));
        user.isActive = false;
        user.isAprove = false;

        // user.save((err) => {
        //     if (err) {
        //         console.err(err);
        //         return next(new errors.InternalError(err.message));
        //         next();
        //     }
        //     res.send(201);
        //     next();
        // });
        user.save().then(() => {
            return user.generateAuthToken();
        }).then((token) => {
            res.header('x-auth', token);
            res.send(user);
            next();

        }).catch((e) => {
            return next(new errors.InternalError(e.message));
            next();
        });

    });
}
module.exports = userRoutes;