var express = require("express");
var router = express.Router();
var auth = require("../modules/auth");
var user = require("../controllers/user");

/* GET current user listing. */
router.get("/", auth.verifyToken, user.currentUser);

module.exports = router;
