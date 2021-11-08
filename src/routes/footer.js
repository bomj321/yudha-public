"user strict";

let express = require("express");
let router = express.Router();

let FooterController = require("../controllers/footer");
let md_auth = require("../middlewares/authenticated");
let multipart = require("connect-multiparty");
let md_upload = multipart({ uploadDir: "./uploads" });

//Test routes
router.post("/footer", md_auth.authenticated, FooterController.save);
router.get("/footer", FooterController.getFooter);
router.put("/footer/:footerId", md_auth.authenticated, FooterController.update);

router.post(
  "/upload-footer-image/:footerId",
  [md_upload, md_auth.authenticated],
  FooterController.uploadImage
);

module.exports = router;
