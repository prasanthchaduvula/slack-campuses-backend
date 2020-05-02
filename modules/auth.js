var jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  var token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "thisissecret", (err, payload) => {
      if (err) return res.status(401).json({ err });
      req.user = payload;
      next();
    });
  } else {
    res.status(401).json({ error: "token is required" });
  }
};
