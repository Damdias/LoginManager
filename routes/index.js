const accountRoutes = require("./AccountRoute");
const userRoutes = require("./UserRoute");
const branchRoutes = require("./BranchRoute");

let routes = (server) => {
    accountRoutes(server);
    userRoutes(server);
    branchRoutes(server);
}
module.exports = routes;