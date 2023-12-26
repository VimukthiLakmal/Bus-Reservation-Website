const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
