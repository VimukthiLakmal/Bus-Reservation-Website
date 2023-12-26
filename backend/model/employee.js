const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  experinceYears: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  bus:{
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default : '1'
  },
  position: {
    type: String,
    required: true
  }
});

const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;
