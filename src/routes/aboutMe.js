"user strict";

let express = require("express");
let router = express.Router();

let AboutMeController = require("../controllers/aboutMe");
let md_auth = require("../middlewares/authenticated");
let multipart = require("connect-multiparty");
let md_upload = multipart({ uploadDir: "./uploads" });

//Test routes
router.post("/about-me", md_auth.authenticated, AboutMeController.save);
router.get("/about-me", AboutMeController.getAboutMe);
router.put(
  "/about-me/:aboutMeId",
  md_auth.authenticated,
  AboutMeController.update
);

router.post(
  "/upload-about-me/:aboutMeId",
  [md_upload, md_auth.authenticated],
  AboutMeController.uploadImage
);

module.exports = router;
