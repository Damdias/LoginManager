let errors = require("restify-errors");
let Branch = require("../models/BranchModel");
let _ = require("lodash");

let branchRoutes = (server) => {
    server.get('/branch/:id', (req, res, next) => {
        let branch = new Branch();
        branch.findOne({ _id: req.params.id }, (err, result) => {
            if (err) {
                next(new errors.InternalServerError(err));
            }
            else {
                res.send(result);
                next();
            }
        });
    });
    server.post('/branch', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'applicaiton/json'")
            );
        }

        let branch = new Branch(_.pick(req.body, ["branchName", "phoneNo", "address"]));
        branch.save().then(() => {
            res.status(201);
            res.send();
            next();
        }).catch((err) => {
            return next(new errors.InternalServerError(err));
        })
    });
}
module.exports = branchRoutes;