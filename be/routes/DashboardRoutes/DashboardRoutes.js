const {
  getDashboard,
} = require("../../controllers/DashboardController/DashboardController.js");
const VerifyUser = require("../../middleware/VerifyUser.js");
let router = require("express").Router();

router.get("/dashboard", VerifyUser, getDashboard);

module.exports = router;
