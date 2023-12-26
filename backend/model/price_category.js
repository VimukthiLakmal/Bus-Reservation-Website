const mongoose = require('mongoose');

const priceCategorySchema = new mongoose.Schema({
  t_price: {
    type: String,
    required: true
  },
  minimum_price: {
    type: String,
    required: true
  }
});

const priceCategory = mongoose.model('price_category', priceCategorySchema);

module.exports = priceCategory;
