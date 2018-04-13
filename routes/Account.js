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

        let user = new User(_.pick(req.body,["userName",'password']));
      
        

        // user.save().then(() => {
        //     return user.generateAuthToken();
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