"user strict";

let express = require("express");
let router = express.Router();

let AwesomeServiceController = require("../controllers/awesomeService");
let md_auth = require("../middlewares/authenticated");

//Test routes
router.post(
  "/awesome-service",
  md_auth.authenticated,
  AwesomeServiceController.save
);
router.get("/awesome-service", AwesomeServiceController.getAwesomeService);
router.put(
  "/awesome-service/:awesomeServiceId",
  md_auth.authenticated,
  AwesomeServiceController.update
);
module.exports = router;
