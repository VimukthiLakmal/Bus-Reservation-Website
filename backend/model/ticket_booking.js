const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  bus: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  bookingDate: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  passengers: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['booked', 'canceled'],
    default: 'booked',
  },
  seatNumbers: {
    type: [String], 
    required: true,
  },
  rating: {
    type: Number,
    default:0
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
