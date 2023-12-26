const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true
  },
  chassisNumber: {
    type: String,
    required: true
  },
  registeredDate: {
    type: Date,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  passengersCapacity: {
    type: Number,
    required: true
  },
  busType: {
    type: String,
    required: true
  },
  kmPerL: {
    type: String,
    required: true
  },
  busRoute: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default : '1'
  },
  busPurpose: {
    type:String
  },
  img: {
    type:String
  },
});

const Bus = mongoose.model('Bus', busSchema);
module.exports = Bus;
