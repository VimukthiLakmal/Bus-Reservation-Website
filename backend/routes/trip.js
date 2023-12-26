const express = require('express');
const router = express.Router();
const Trip = require('../model/trip_organize'); 

// Route for creating a new trip
router.post('/addTrips', async (req, res) => {
  try {
    const newTrip = new Trip(req.body);
    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message );
  }
});

// Route for getting all trips
router.get('/trips', async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route for getting a specific trip by ID
router.get('/trips/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route for getting a specific trip by user ID
router.get('/trip/:uid', async (req, res) => {
  try {
    const trip = await Trip.find({ customerId: req.params.uid});
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Route for updating rating
router.put('/trips/ratings/:id', async (req, res) => {
 
  try {
    const query = { _id: req.params.id }; 
    const update = { $set: { rating: req.body.rating } }; 
    const updatedTrip = await Trip.findByIdAndUpdate(query, update, { new: true });
    res.json(updatedTrip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Route for updating a specific trip by ID
router.put('/trips/:id', async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(updatedTrip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route for deleting a specific trip by ID
router.delete('/trips/:id', async (req, res) => {
  try {
    const deletedTrip = await Trip.findByIdAndRemove(req.params.id);
    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/busAvailabilityCheck', async (req, res) => {
    try {
      const { busNumber, startDate, endDate } = req.body;
  
      // Check if any trip is already scheduled for the same bus during the given period
      const existingTrip = await Trip.findOne({
        buNumber: busNumber,
        startDate: { $lte: endDate }, // Check if trip starts before or on the specified end date
        endDate: { $gte: startDate }, 
      });
  
      if (existingTrip) {
        // Bus is not available for the given period
        res.status(200).json({ status: true , message: 'Bus is Already Booked.' });
      } else {
        // Bus is available for the given period
        res.status(200).json({  status: false , message: 'Bus is Available.' });
      }
    } catch (error) {
      console.error('Error checking bus availability:', error);
      res.status(500).json({ error: 'Failed to check bus availability.' });
    }
});


// PUT route to cancel a trip booking by ID
// router.put('/cancelTripBooking/:id', async (req, res) => {
//   const tripId = req.params.id;

//   try {
//     // Find the trip with the given ID in the database
//     const trip = await Trip.findById(tripId);

//     if (!trip) {
//       return res.status(404).json({ message: 'Trip not found.' });
//     }

//     if (trip.status !== 'booked') {
//       return res.status(400).json({ message: 'Trip is not booked; cannot cancel.' });
//     }

//     // Perform the cancellation operation (update the status to 'canceled')
//     trip.status = 'canceled';
//     await trip.save();

//     res.json({ message: 'Trip booking successfully canceled.', trip });
//   } catch (error) {
//     console.error('Error canceling trip booking:', error);
//     res.status(500).json({ message: 'An error occurred while canceling the trip booking.' });
//   }
// });

router.put('/updateTripStatus/:id', async (req, res) => {
  const tripId = req.params.id;
  const { status } = req.body;

  try {
    if (!status) {
      return res.status(400).json({ error: 'Status field is required' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    trip.status = status;
    await trip.save();
    res.json({ message: 'Trip booking successfully '+status+'.', trip });
  } catch (error) {
    // Handle database or server errors
    console.error('Error updating trip status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
 
module.exports = router;
