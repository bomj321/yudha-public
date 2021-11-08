"user strict";

let express = require("express");
let router = express.Router();

let ServiceController = require("../controllers/service");
let md_auth = require("../middlewares/authenticated");
let multipart = require("connect-multiparty");
let md_upload = multipart({ uploadDir: "./uploads" });

//Test routes
router.post("/service", md_auth.authenticated, ServiceController.save);
router.get("/service/:serviceId", ServiceController.getService);

router.get("/services/:page?/:pageSize?", ServiceController.getServices);

router.put(
  "/service/:serviceId",
  md_auth.authenticated,
  ServiceController.update
);

router.post(
  "/upload-service-banner-image/:serviceId",
  [md_upload, md_auth.authenticated],
  ServiceController.uploadBannerImage
);

router.post(
  "/upload-service-first-media/:serviceId",
  [md_upload, md_auth.authenticated],
  ServiceController.uploadFirstMedia
);

router.post(
  "/upload-service-second-media/:serviceId",
  [md_upload, md_auth.authenticated],
  ServiceController.uploadSecondMedia
);

router.post(
  "/upload-service-third-media/:serviceId",
  [md_upload, md_auth.authenticated],
  ServiceController.uploadThirdMedia
);

router.delete(
  "/service/:serviceId",
  md_auth.authenticated,
  ServiceController.delete
);

module.exports = router;
