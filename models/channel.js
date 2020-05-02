var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var channelSchema = new Schema({
  messagesId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  name: {
    type: String,
    required: true,
  },
  adminsId: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  membersId: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  private: {
    default: false,
  },
  campusId: {
    type: Schema.Types.ObjectId,
    ref: "Campus",
  },
});

module.exports = mongoose.model("Channel", channelSchema);
