const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  like_dislike: {
    type: Boolean,
    default: true,
  },
  bike_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Bike",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
