const express = require('express');
const Payment = require('../model/payment'); 

const router = express.Router();

// Route for creating a new payment record
router.post('/addPayments', async (req, res) => {
  try {
    const { customerId, amount, paymentMethod, bookingId, bookingType } = req.body;

    // Create a new payment record in the database
    const newPayment = new Payment({
      customerId,
      amount,
      paymentMethod,
      bookingId,
      bookingType,
    });

    const savedPayment = await newPayment.save();

    res.status(201).json({ success: true, payment: savedPayment });
  } catch (error) {
    console.error('Error creating payment:', error.message);
    res.status(500).json({ success: false, error: 'Payment could not be processed.' });
  }
});

module.exports = router;
