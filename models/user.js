var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: /@/,
    },
    name: {
      type: String,
      required: true,
    },
    dp: {
      type: String,
    },
    campusesId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Campus",
      },
    ],
  },
  { timestamps: true }
);

// export model
module.exports = mongoose.model("User", userSchema);
