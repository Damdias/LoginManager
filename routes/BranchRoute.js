let errors = require("restify-errors");
let User = require("../models/User");
let _ = require("lodash");

let branchRoutes = (server) => {
    server.get('/branch', (req, res, next) => {
        res.send({'name':'Malabe'});
        next();
    });
}
module.exports = branchRoutes;