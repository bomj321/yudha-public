"user strict";

let express = require("express");
let router = express.Router();
let UserController = require("../controllers/user");
let md_auth = require("../middlewares/authenticated");

//Users routes
router.post("/register", UserController.save);
router.post("/login", UserController.login);
router.put("/update", md_auth.authenticated, UserController.update);
router.get(
  "/users/:page?/:pageSize?",
  md_auth.authenticated,
  UserController.getUsers
);
router.get("/user/:userId", md_auth.authenticated, UserController.getUser);

module.exports = router;
