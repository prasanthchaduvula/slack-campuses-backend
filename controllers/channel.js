var Channel = require("../models/channel");
var Campus = require("../models/campus");

// create channel
const createChannel = (req, res) => {
  Campus.findOne({ name: req.params.slug }, (err, campus) => {
    if (err) return res.json({ err });
    if (!campus) return res.json({ message: "campus not found" });
    if (campus.channels.includes(req.body.name))
      return res.json({ message: "already channel there", success: false });
    if (!campus.channels.includes(req.body.name)) {
      Channel.create(req.body, (err, newChannel) => {
        if (err) return res.json({ err });
        Channel.findByIdAndUpdate(
          newChannel._id,
          {
            $push: {
              adminsId: req.user.userId,
              membersId: req.user.userId,
              campusId: campus._id,
            },
          },
          { new: true },
          (err, updatedChannel) => {
            if (err) return res.json({ err });
            Campus.findByIdAndUpdate(
              campus._id,
              {
                $push: {
                  channels: updatedChannel.name,
                  channelsId: updatedChannel.id,
                },
              },
              { new: true },
              (err, updatedCampus) => {
                if (err) return res.json({ err });
                res.json({ updatedCampus, updatedChannel, success: true });
              }
            );
          }
        );
      });
    }
  });
};

// join channel
const joinChannel = (req, res) => {
  Channel.findById(req.params.id, (err, channel) => {
    if (err) return res.json({ err });
    if (!channel)
      return res.json({ message: "channel not found", success: false });
    if (channel) {
      if (channel.membersId.includes(req.user.userId))
        return res.json({ message: "already memeber", success: false });
      Campus.findById(channel.campusId, (err, campus) => {
        if (err) return res.json({ err });
        if (!campus)
          return res.json({ message: "campus not found", success: false });
        if (campus) {
          if (!campus.people.includes(req.user.userId))
            return res.json({
              message: "you are not member of campus",
              success: "false",
            });
          Channel.findByIdAndUpdate(
            req.params.id,
            { $push: { membersId: req.user.userId } },
            { new: true },
            (err, updatedChannel) => {
              if (err) return res.json({ err });
              res.json({ updatedChannel, success: true });
            }
          );
        }
      });
    }
  });
};

// leave channel
const leaveChannel = (req, res) => {
  Channel.findById(req.params.id, (err, channel) => {
    if (err) return res.json({ err });
    if (!channel)
      return res.json({ message: "channel not found", success: false });
    if (channel) {
      if (!channel.membersId.includes(req.user.userId))
        return res.json({
          message: "you are not memeber of this channel",
          success: false,
        });
      Campus.findById(channel.campusId, (err, campus) => {
        if (err) return res.json({ err });
        if (!campus)
          return res.json({ message: "campus not found", success: false });
        if (campus) {
          if (!campus.people.includes(req.user.userId))
            return res.json({
              message: "you are not member of campus",
              success: "false",
            });
          Channel.findByIdAndUpdate(
            req.params.id,
            { $pull: { membersId: req.user.userId } },
            { new: true },
            (err, updatedChannel) => {
              if (err) return res.json({ err });
              res.json({ updatedChannel, success: true });
            }
          );
        }
      });
    }
  });
};

module.exports = { createChannel, joinChannel, leaveChannel };
