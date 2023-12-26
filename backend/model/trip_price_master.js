const mongoose = require('mongoose');

const tripPriceMasterSchema = new mongoose.Schema({
  km_per_rs: {
    type: Number,
    required: true,
  },
  initial_price: {
    type: Number,
    required: true,
  },
  extra_price_per_day: {
    type: Number,
    required: true,
  },
});

const TripPriceMaster = mongoose.model('TripPriceMaster', tripPriceMasterSchema);
module.exports = TripPriceMaster;
