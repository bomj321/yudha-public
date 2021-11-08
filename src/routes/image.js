"user strict";

let express = require("express");
let router = express.Router();

let ImageController = require("../controllers/image");

router.get("/image/:fileName", ImageController.image);

module.exports = router;
