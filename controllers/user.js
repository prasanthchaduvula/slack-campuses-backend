var User = require("../models/user");

// get current user
const currentUser = (req, res) => {
  User.findById(req.user.userId)
    .populate("campusesId")
    .exec((err, user) => {
      if (err) return res.json({ err });
      if (!user) return res.json({ message: "user not found", success: false });
      res.json({ user, success: true });
    });
};

module.exports = { currentUser };
