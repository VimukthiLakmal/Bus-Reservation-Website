const mongoose = require('mongoose');

const ticketPriceSchema = new mongoose.Schema({
  role_name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  }
});

const ticketPrice = mongoose.model('ticket_price', ticketPriceSchema);

module.exports = ticketPrice;
