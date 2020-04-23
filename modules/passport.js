var passport = require("passport");
var User = require("../models/user");
var jwt = require("jsonwebtoken");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "272830263327-vujr7b64vbd3oddjgvs4akcorr92uq19.apps.googleusercontent.com",
      clientSecret: "urSu9Y7eIOIUiIo7bz1iJTZ-",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOne({ email: profile._json.email }, (error, user) => {
        if (!user) {
          User.create(
            {
              name: profile._json.name,
              email: profile._json.email,
              dp: profile._json.picture,
            },
            (error, user) => {
              return cb(error, user);
            }
          );
        } else {
          return cb(error, user);
        }
      });
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) return cb(err, false);
    cb(null, user);
  });
});
