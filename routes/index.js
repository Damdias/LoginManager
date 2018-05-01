const accountRoutes = require("./AccountRoute");
const userRoutes = require("./UserRoute");
const branchRoutes = require("./BranchRoute");
const cityRoutes = require("./CityRoute");

let routes = (server) => {
    accountRoutes(server);
    userRoutes(server);
    branchRoutes(server);
    cityRoutes(server);

}
module.exports = routes;