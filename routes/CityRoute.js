let errors = require("restify-errors");
let City = require("../models/CityModel");
let _ = require("lodash");
const AuthMiddleware = require("../middleware/AuthMiddleware");

let cityRoutes = (server) => {
    server.get('/cities/:id', AuthMiddleware, (req, res, next) => {

        City.findOne({ _id: req.params.id }, (err, result) => {
            if (err) {
                next(new errors.InternalServerError(err));
            }
            else {
                res.send(result);
                next();
            }
        });
    });
    server.post('/cities', AuthMiddleware, (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'")
            );
        }
        let city = new City(_.pick(req.body, ["name"]));
        city.save().then((city) => {
            res.status(201);
            res.send({ msg: 'Branch create success' });
            next();
        })
            .catch((er) => {
                res.send({ msg: "Can't create city", err: er });
                return next();
            })
    });
    server.get('/cities', AuthMiddleware, (req, res, next) => {

        City.find().then((result) => {
            res.send(result);
            next();
        },
            (err) => {
                res.send({ msg: "Can't find the Cities ", err });
                next();
            });
    });

}
module.exports = cityRoutes;