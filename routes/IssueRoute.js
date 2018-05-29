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
        issue.save().then((issue) => {
            res.status(201);
            res.send({ 'msg': 'Issue Created success' });
            next();

        }).catch((e) => {
            return next(new errors.InternalError(e.message));
            next();
        });

    });
    server.put('/issue', (req, res, next) => {

        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'")
            );
        }
        let issuebody = _.pick(req.body, ["title", 'description', 'branchId', 'branchName',
         'CreatedId', 'CreatedByName','AssignToUserId','AssignToUserName','images','Status',"IssueType"]);
         Issue.findOne({ _id: req.body._id }).then((issue) => {
            if (!issue) {
                return next(new errors.InvalidArgumentError("Can't find Issue"))
            }
            issue.title = issuebody.title;
            issue.description = issuebody.description;
            issue.branchId = issuebody.branchId;
            issue.branchName = issuebody.branchName;
            issue.CreatedId = issuebody.CreatedId;
            issue.CreatedByName = issuebody.CreatedByName;
            issue.AssignToUserId = issuebody.AssignToUserId;
            issue.AssignToUserName = issuebody.AssignToUserName;
            issue.images = issuebody.images;
            issue.Status = issuebody.Status;
            issue.IssueType = issuebody.IssueType;
            issue.save();
            res.status(201);
            res.send({ 'msg': 'Issue  update success' });
            next();

        }).catch((e) => {
            return next(new errors.InternalError(e.message));
            next();
        });

    });
    server.put('/updateIssueStatus', (req, res, next) => {

        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'")
            );
        }
        let issuebody = _.pick(req.body, ['Status']);
         Issue.findOne({ _id: req.body._id }).then((issue) => {
            if (!issue) {
                return next(new errors.InvalidArgumentError("Can't find Issue"))
            }
            issue.IssueType = issuebody.IssueType;
            issue.save();
            res.status(201);
            res.send({ 'msg': 'Issue  update success' });
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