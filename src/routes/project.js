"user strict";

let express = require("express");
let router = express.Router();

let ProjectController = require("../controllers/project");
let md_auth = require("../middlewares/authenticated");
let multipart = require("connect-multiparty");
let md_upload = multipart({ uploadDir: "./uploads" });

//Test routes
router.post("/project", md_auth.authenticated, ProjectController.save);
router.get("/project/:projectId", ProjectController.getProject);

router.get("/projects/:page?/:pageSize?", ProjectController.getProjects);

router.put(
  "/project/:projectId",
  md_auth.authenticated,
  ProjectController.update
);
router.post(
  "/upload-project-banner-image/:projectId",
  [md_upload, md_auth.authenticated],
  ProjectController.uploadBannerImage
);

router.post(
  "/upload-project-additional-image/:projectId",
  [md_upload, md_auth.authenticated],
  ProjectController.uploadAdditionalImage
);

router.delete(
  "/project/:projectId",
  md_auth.authenticated,
  ProjectController.delete
);

module.exports = router;
