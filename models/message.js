const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

MessageSchema.virtual("timestamp").get(function () {
  const inMilSecCreatedAt = Date.parse(this.createdAt);
  const currentDateInMilSec = new Date().getTime();
  const timestampInMilSec = currentDateInMilSec - inMilSecCreatedAt;
  const timestampInSec = timestampInMilSec / 1000;
  const inMinutes = timestampInSec / 60;
  const inHours = inMinutes / 60;
  const inDays = inHours / 24;

  let formattedTimestamp = null;
  if (inMinutes < 1) {
    formattedTimestamp = Math.ceil(timestampInSec) + " Sec";
  }
  if (inMinutes < 60 && inMinutes > 1) {
    formattedTimestamp = Math.floor(inMinutes) + " Min";
  }
  if (inHours < 24 && inHours > 1) {
    formattedTimestamp = Math.floor(inHours) + " H";
  }
  if (Math.floor(inDays) === 1) {
    formattedTimestamp = Math.floor(inDays) + "  Day";
  }
  if (inDays > 2) {
    formattedTimestamp = Math.floor(inDays) + " Days";
  }
  return formattedTimestamp;
});

module.exports = mongoose.model("Message", MessageSchema);
