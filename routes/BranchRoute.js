let errors = require("restify-errors");
let Branch = require("../models/BranchModel");
let _ = require("lodash");
const AuthMiddleware = require("../middleware/AuthMiddleware");

let branchRoutes = (server) => {
    server.get('/branch/:id', AuthMiddleware, (req, res, next) => {
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
    server.get('/branches', AuthMiddleware, (req, res, next) => {
        Branch.find().then((branches) => {

            res.send(branches);
            next();

        }, (err) => {
            res.send({ msg: 'Cant find Branches', err });
            return next();
        });

    });
    server.post('/branch', AuthMiddleware, (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'")
            );
        }

        let branch = new Branch(_.pick(req.body, ["branchName", "phoneNo", "address", 'city', 'cityId', "supervisorId", "supervisor"]));
        branch.save().then(() => {
            res.status(201);
            res.send({ msg: 'Branch create success' });
            next();
        }).catch((err) => {
            return next(new errors.InternalServerError(err));
        })
    });
    server.put('/branch', AuthMiddleware, (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'")
            );
        }
        let branch = new Branch(_.pick(req.body, ["_id", "branchName", "phoneNo", "address", 'city', 'cityId', "supervisorId", "supervisor"]));
        Branch.findByIdAndUpdate(branch._id,{$set:{address:branch.address,branchName:branch.branchName}}).then(() => {
            res.status(201);
            res.send({ msg: 'Branch update success' });
            next();
        }).catch((err) => {
            return next(new errors.InternalServerError(err));
        })
    });
    server.del('/branch/:id', AuthMiddleware, (req, res, next) => {

        let branchid = req.params.id;
        Branch.remove({ "_id": branchid }).then(() => {
            res.status(201);
            res.send({ msg: 'Remove branch success' });
            next();
        }).catch((err) => {
            return next(new errors.InternalServerError(err));
        })
    });
}
module.exports = branchRoutes;