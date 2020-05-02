var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var campusSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    channelsId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],
    channels: [],
    people: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    creator: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// export model
module.exports = mongoose.model("Campus", campusSchema);
