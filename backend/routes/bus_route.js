const express = require('express');
const router = express.Router();
const BusRoute = require('../model/bus_route'); // Import the BusRoute Mongoose model

// POST route to add a new bus route
router.post('/addRoute', async (req, res) => {
  try {
    const { routeNumber, startPoint, endPoint, description } = req.body;
    const newBusRoute = new BusRoute({
      routeNumber,
      startPoint,
      endPoint,
      description,
    });
    await newBusRoute.save();
    res.status(201).json(newBusRoute);
  } catch (error) {
    console.error('Error adding new bus route:', error);
    res.status(500).json({ error: 'Failed to add new bus route.' });
  }
});

// GET route to fetch all bus routes
router.get('/getRoutes', async (req, res) => {
  try {
    const allBusRoutes = await BusRoute.find();
    res.json(allBusRoutes);
  } catch (error) {
    console.error('Error fetching bus routes:', error);
    res.status(500).json({ error: 'Failed to fetch bus routes.' });
  }
});

// Update a bus route by ID
router.put('/updateRoutes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { routeNumber, startPoint, endPoint, description } = req.body;
  
      // Find the bus route by ID
      const busRoute = await BusRoute.findById(id);
  
      if (!busRoute) {
        return res.status(404).json({ error: 'Bus route not found.' });
      }
  
      // Update the bus route properties
      busRoute.routeNumber = routeNumber;
      busRoute.startPoint = startPoint;
      busRoute.endPoint = endPoint;
      busRoute.description = description;
  
      // Save the updated bus route
      const updatedBusRoute = await busRoute.save();
  
      res.json(updatedBusRoute);
    } catch (error) {
      console.error('Error updating bus route:', error);
      res.status(500).json({ error: 'Failed to update bus route.' });
    }
});


// Delete a bus route by ID
router.delete('/deleteRoutes/:id', async (req, res) => {
    try {
        const bus = await BusRoute.findByIdAndDelete(req.params.id);
        if (!bus) {
          return res.status(404).json({ error: 'Bus not found' });
        }
        res.status(200).json({ message: 'Bus deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
