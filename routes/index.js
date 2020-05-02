var express = require("express");
var router = express.Router();
var passport = require("passport");
var auth = require("../modules/auth");
const jwt = require("jsonwebtoken");

router.get("/api", (req, res) => {
  res.json({ hi: "hi" });
});
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    console.log("user");
    jwt.sign(
      { email: req.user.email, userId: req.user._id },
      "thisissecret",
      (err, token) => {
        console.log("token generated");
        // send the token to client
        res.redirect(`http://localhost:3001/oauth/?t=${token}`);
      }
    );
  }
);
module.exports = router;
