"user strict";

let express = require("express");
let router = express.Router();
let TabController = require("../controllers/tab");
let md_auth = require("../middlewares/authenticated");

//Users routes
router.post("/tab", md_auth.authenticated, TabController.save);
router.put("/tab/:tabId", md_auth.authenticated, TabController.update);
router.get("/tabs/:page?/:pageSize?", TabController.getTabs);
router.get("/tab/:tabId", TabController.getTab);
router.delete("/tab/:tabId", md_auth.authenticated, TabController.delete);

module.exports = router;
