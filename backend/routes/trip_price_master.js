const express = require('express');
const router = express.Router();
const TripPriceMaster = require('../model/trip_price_master');

// Create a new trip price master record
router.post('/addPricePlan', async (req, res) => {
  try {
    const { km_per_rs, initial_price, extra_price_per_day } = req.body;
    const tripPriceMaster = new TripPriceMaster({
      km_per_rs,
      initial_price,
      extra_price_per_day,
    });
    await tripPriceMaster.save();
    res.status(201).json(tripPriceMaster);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all trip price master records
router.get('/getPricePlan', async (req, res) => {
  try {
    const tripPriceMasters = await TripPriceMaster.find();
    res.json(tripPriceMasters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trip price masters' });
  }
});

// Get a single trip price master record by ID
router.get('/getPricePlan:id', async (req, res) => {
  try {
    const tripPriceMaster = await TripPriceMaster.findById(req.params.id);
    if (!tripPriceMaster) {
      return res.status(404).json({ error: 'Trip price master not found' });
    }
    res.json(tripPriceMaster);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trip price master' });
  }
});

// Update a trip price master record by ID
router.put('/updatePricePlan:id', async (req, res) => {
  try {
    const { km_per_rs, initial_price, extra_price_per_day } = req.body;
    const updatedTripPriceMaster = await TripPriceMaster.findByIdAndUpdate(
      req.params.id,
      { km_per_rs, initial_price, extra_price_per_day },
      { new: true }
    );
    if (!updatedTripPriceMaster) {
      return res.status(404).json({ error: 'Trip price master not found' });
    }
    res.json(updatedTripPriceMaster);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a trip price master record by ID
router.delete('/deletePricePlan:id', async (req, res) => {
  try {
    const deletedTripPriceMaster = await TripPriceMaster.findByIdAndRemove(req.params.id);
    if (!deletedTripPriceMaster) {
      return res.status(404).json({ error: 'Trip price master not found' });
    }
    res.json({ message: 'Trip price master deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete trip price master' });
  }
});

module.exports = router;
