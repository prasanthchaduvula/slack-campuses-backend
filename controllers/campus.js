var Campus = require("../models/campus");
var Channel = require("../models/channel");
var User = require("../models/user");
// get all campuses
const allCampuses = (req, res) => {
  Campus.find({}, (err, allCampuses) => {
    if (err) return res.json({ err });
    res.json({ allCampuses });
  });
};

// create campus
const createCampus = (req, res) => {
  console.log(req.user.userId);
  Campus.findOne({ name: req.body.name }, (err, campus) => {
    if (err) return res.json({ err });
    if (campus)
      return res.json({
        success: false,
        message: "campus already there with same name",
      });
    if (!campus) {
      Campus.create(req.body, (err, newCampus) => {
        if (err) return res.json({ err });
        req.body.name = "#general";
        Channel.create(req.body, (err, newChannel) => {
          if (err) return res.json({ err });
          Channel.findByIdAndUpdate(
            newChannel._id,
            {
              $push: {
                adminsId: req.user.userId,
                membersId: req.user.userId,
                campusId: newCampus._id,
              },
            },
            { new: true },
            (err, updatedChannel) => {
              if (err) return res.json({ err });
              Campus.findByIdAndUpdate(
                newCampus._id,
                {
                  $push: {
                    channels: updatedChannel.name,
                    channelsId: updatedChannel.id,
                    creator: req.user.userId,
                    people: req.user.userId,
                  },
                },
                { new: true },
                (err, updatedCampus) => {
                  if (err) return res.json({ err });
                  User.findByIdAndUpdate(
                    req.user.userId,
                    { $push: { campusesId: updatedCampus.id } },
                    { new: true },
                    (err, updatedUser) => {
                      res.json({
                        updatedUser,
                        updatedCampus,
                        updatedChannel,
                        success: true,
                        message: "created succssfully",
                      });
                    }
                  );
                }
              );
            }
          );
        });
      });
    }
  });
};

// join campus
const joinCampus = (req, res) => {
  console.log(req.user);
  Campus.findById(req.params.id, (err, campus) => {
    if (err) return res.json({ err });
    if (!campus) return res.json({ message: "campus not found" });
    if (campus.people.includes(req.user.userId))
      return res.json({ message: "already you are member" });
    if (!campus.people.includes(req.user.userId)) {
      Campus.findByIdAndUpdate(
        req.params.id,
        { $push: { people: req.user.userId } },
        { new: true },
        (err, updatedCampus) => {
          updatedCampus.channelsId.map((channelId) => {
            Channel.findById(channelId, (err, channel) => {
              if (channel.name == "#general") {
                Channel.findByIdAndUpdate(
                  channel._id,
                  { $push: { membersId: req.user.userId } },
                  { new: true },
                  (err, updatedChannel) => {
                    if (err) return res.json({ err });
                    User.findByIdAndUpdate(
                      req.user.userId,
                      { $push: { campusesId: updatedCampus._id } },
                      { new: true },
                      (err, updatedUser) => {
                        res.json({
                          updatedUser,
                          updatedCampus,
                          updatedChannel,
                          success: true,
                        });
                      }
                    );
                  }
                );
              }
            });
          });
        }
      );
    }
  });
};

module.exports = { createCampus, allCampuses, joinCampus };
