const mongoose = require("mongoose");

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

const Bike = mongoose.model("Bike", BikeSchema);
module.exports = Bike;
