var express = require("express");
var router = express.Router();
var campus = require("../controllers/campus");
var auth = require("../modules/auth");
/* Create campus  */
router.post("/", auth.verifyToken, campus.createCampus);

// get all campuses
router.get("/", campus.allCampuses);

// join campus
router.post("/:id", auth.verifyToken, campus.joinCampus);

module.exports = router;
