"user strict";

let express = require("express");
let router = express.Router();

let NewController = require("../controllers/new");
let md_auth = require("../middlewares/authenticated");
let multipart = require("connect-multiparty");
let md_upload = multipart({ uploadDir: "./uploads" });

//Test routes
router.post("/new", md_auth.authenticated, NewController.save);
router.get("/new/:reportId", NewController.getNew);
router.get("/news/:page?/:pageSize?", NewController.getNews);
router.put("/new/:reportId", md_auth.authenticated, NewController.update);

router.post(
  "/upload-new-banner-image/:reportId",
  [md_upload, md_auth.authenticated],
  NewController.uploadBannerImage
);

router.post(
  "/upload-new-featured-image/:reportId",
  [md_upload, md_auth.authenticated],
  NewController.uploadFeaturedImage
);

router.post(
  "/upload-new-leftImage-image/:reportId",
  [md_upload, md_auth.authenticated],
  NewController.uploadLeftImage
);

router.post(
  "/upload-new-video-image/:reportId",
  [md_upload, md_auth.authenticated],
  NewController.uploadVideoImage
);

router.delete("/new/:reportId", md_auth.authenticated, NewController.delete);
module.exports = router;
