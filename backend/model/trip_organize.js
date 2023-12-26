const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  customerId: {
    type: String,
  },
  destination: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  participants: {
    type: String,
    required: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  telphoneContact: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  discount: {
    type: String,
    required: true
  },
  specifications: {
    type: String,
    required: true
  },
  buNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default:'booked'
  },
  rating: {
    type: Number,
    default:0
  }
});

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
