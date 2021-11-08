"user strict";

let express = require("express");
let router = express.Router();

let LatestProjectController = require("../controllers/latestProject");
let md_auth = require("../middlewares/authenticated");

//Test routes
router.post(
  "/latest-project",
  md_auth.authenticated,
  LatestProjectController.save
);
router.get("/latest-project", LatestProjectController.getLatestProject);
router.put(
  "/latest-project/:latestProjectId",
  md_auth.authenticated,
  LatestProjectController.update
);

module.exports = router;
