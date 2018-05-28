let errors = require("restify-errors");
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

        let issue = new Issue(_.pick(req.body, ["title", 'description', 'branchId', 'branchName',
         'CreatedId', 'CreatedByName','AssignToUserId','AssignToUserName','images','Status',"IssueType"]));

        console.log("create issue",);
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
        Issue.find().then((issues) => {
            res.send(issues);
            next();
        }).catch((err) => {
            return next(new errors.InternalError(err));
        })

    });
}
module.exports = issueRoutes;