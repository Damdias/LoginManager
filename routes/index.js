const accountRoutes = require("./AccountRoute");
const userRoutes = require("./UserRoute");
const branchRoutes = require("./BranchRoute");
const cityRoutes = require("./CityRoute");
const fileUploadRoutes = require("./FileUpload");
const issueRoutes = require("./IssueRoute");
let routes = (server) => {
    accountRoutes(server);
    userRoutes(server);
    branchRoutes(server);
    cityRoutes(server);
    fileUploadRoutes(server);
    issueRoutes(server);

}
module.exports = routes;