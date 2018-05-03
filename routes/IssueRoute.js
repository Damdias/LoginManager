let errors = require("restify-errors");
let User = require("../models/User");
const Issue = require("../models/IssueModel");
let _ = require("lodash");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const emailService = require("../services/EmailService");
let issueRoutes = (server) => {
    server.post('/issue', (req, res, next) => {

        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'")
            );
        }

        let issue = new Issue(_.pick(req.body, ["issueName", 'description', 'branchId', 'branchName', 'CreatedId', 'CreatedByName']));

        issue.save().then((user) => {
            res.status(201);
            res.send({ 'msg': 'User Created success' });
            next();

        }).catch((e) => {
            return next(new errors.InternalError(e.message));
            next();
        });

    });
    server.get('/issues', AuthMiddleware, (req, res, next) => {
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
}
module.exports = issueRoutes;