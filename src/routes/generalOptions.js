"user strict";

let express = require("express");
let router = express.Router();

let GeneralOptionsController = require("../controllers/generalOptions");
let md_auth = require("../middlewares/authenticated");
let multipart = require("connect-multiparty");
let md_upload = multipart({ uploadDir: "./uploads" });

//Test routes
router.post(
  "/general-options",
  md_auth.authenticated,
  GeneralOptionsController.save
);
router.get("/general-options", GeneralOptionsController.getGeneralOptions);
router.put(
  "/general-options/:generalOptionsId",
  md_auth.authenticated,
  GeneralOptionsController.update
);

router.post(
  "/upload-general-options-logo/:generalOptionsId",
  [md_upload, md_auth.authenticated],
  GeneralOptionsController.uploadLogo
);

module.exports = router;
