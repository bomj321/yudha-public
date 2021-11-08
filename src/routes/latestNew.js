"user strict";

let express = require("express");
let router = express.Router();

let LatestNewController = require("../controllers/latestNew");
let md_auth = require("../middlewares/authenticated");

//Test routes
router.post("/latest-new", md_auth.authenticated, LatestNewController.save);
router.get("/latest-new", LatestNewController.getLatestNew);
router.put(
  "/latest-new/:latestNewId",
  md_auth.authenticated,
  LatestNewController.update
);

module.exports = router;
