const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    required: true,
  },
  bikeid: {
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

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
