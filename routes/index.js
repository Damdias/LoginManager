const accountRoutes = require("./Account");
const userRoutes = require("./User");

let routes = (server) => {
    accountRoutes(server);
    userRoutes(server);
}
module.exports = routes;