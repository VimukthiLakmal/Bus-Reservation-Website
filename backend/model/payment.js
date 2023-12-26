const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  bookingId: {
    type: String,
    required: true,
  },
  bookingType: {
    type: String,
    required: true,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
