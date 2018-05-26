const accountRoutes = require("./AccountRoute");
const userRoutes = require("./UserRoute");
const branchRoutes = require("./BranchRoute");
const cityRoutes = require("./CityRoute");
const fileUploadRoutes = require("./FileUpload");
let routes = (server) => {
    accountRoutes(server);
    userRoutes(server);
    branchRoutes(server);
    cityRoutes(server);
    fileUploadRoutes(server);

}
module.exports = routes;