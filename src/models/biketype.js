const mongoose = require("mongoose");

const bikeTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
  },
});

const BikeType = mongoose.model("BikeType", bikeTypeSchema);
module.exports = BikeType;
