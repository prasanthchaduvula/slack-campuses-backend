var express = require("express");
var router = express.Router();
var channel = require("../controllers/channel");
var auth = require("../modules/auth");
/* Create campus  */
router.post("/:slug", auth.verifyToken, channel.createChannel);

module.exports = router;
