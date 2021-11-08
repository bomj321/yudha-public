"user strict";

let express = require("express");
let router = express.Router();

let HeaderController = require("../controllers/header");
let md_auth = require("../middlewares/authenticated");
let multipart = require("connect-multiparty");
let md_upload = multipart({ uploadDir: "./uploads" });

//Test routes
router.post("/header", md_auth.authenticated, HeaderController.save);
router.get("/header", HeaderController.getHeader);
router.put("/header/:headerId", md_auth.authenticated, HeaderController.update);
router.post(
  "/upload-header-image/:headerId",
  [md_upload, md_auth.authenticated],
  HeaderController.uploadImage
);

module.exports = router;
