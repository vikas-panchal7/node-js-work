const mongoose = require("mongoose");
const Like = require("./like");
const Comment = require("./comment");

const BikeSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  biketype: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BikeType",
  },
});

//
// when remove bike bike likes and comment will be removed

BikeSchema.pre("remove", async function (next) {
  const bike = this;
  await Like.deleteMany({ bikeid: bike._id });
  await Comment.deleteMany({ bikeid: bike._id });
  next();
});

//
const Bike = mongoose.model("Bike", BikeSchema);
module.exports = Bike;
