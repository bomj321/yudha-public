"user strict";

let express = require("express");
let router = express.Router();

let HireController = require("../controllers/hire");
let md_auth = require("../middlewares/authenticated");
let multipart = require("connect-multiparty");
let md_upload = multipart({ uploadDir: "./uploads" });

//Test routes
router.post("/hire", md_auth.authenticated, HireController.save);
router.get("/hire", HireController.getHire);
router.put("/hire/:hireId", md_auth.authenticated, HireController.update);

router.post(
  "/upload-hire-image/:hireId",
  [md_upload, md_auth.authenticated],
  HireController.uploadImage
);

module.exports = router;
