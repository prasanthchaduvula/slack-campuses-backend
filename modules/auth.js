const jwt = require("jsonwebtoken");

module.exports = {
  generateToken: (user) =>
    jwt.sign(
      { email: user.email, userId: user._id },
      "thisissecret",
      (err, token) => {
        console.log("token generated");
        // send the token to client
        return token;
        // res.json({
        //   token,
        //   success: true,
        //   email: user.email,
        //   userId: user._id,
        // });
      }
    ),
};
