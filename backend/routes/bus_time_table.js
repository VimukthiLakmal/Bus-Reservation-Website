const express = require('express');
const router = express.Router();
const BusTimeTable = require('../model/bus_time_table');

// Fetch all bus time table entries
router.get('/getBusTimeTable', async (req, res) => {
  try {
    const busTimeTable = await BusTimeTable.find();
    res.json(busTimeTable);
  } catch (error) {
    console.error('Error fetching bus time table:', error);
    res.status(500).json({ error: 'An error occurred while fetching bus time table' });
  }
});

// Add a new bus time table entry
router.post('/addBusTimeTable', async (req, res) => {
  try {
    const newBusTimeTable = await BusTimeTable.create(req.body);
    res.status(201).json(newBusTimeTable);
  } catch (error) {
    console.error('Error creating bus time table entry:', error);
    res.status(500).json({ error: 'An error occurred while creating bus time table entry' });
  }
});

// Update an existing bus time table entry
router.put('/updateBusTimeTable/:id', async (req, res) => {
    const { id } = req.params;
    const { startTime, endTime } = req.body;
  
    try {
      // Find the bus time table entry by ID
      const busTimeTableEntry = await BusTimeTable.findById(id);
  
      if (!busTimeTableEntry) {
        return res.status(404).json({ message: 'Bus time table entry not found.' });
      }
  
      // Update the startTime and endTime fields
      if (startTime) {
        busTimeTableEntry.startTime = startTime;
      }
  
      if (endTime) {
        busTimeTableEntry.endTime = endTime;
      }
  
      // Save the updated entry
      await busTimeTableEntry.save();
  
      res.json({ message: 'Bus time table entry updated successfully.', data: busTimeTableEntry });
    } catch (error) {
      console.error('Error updating bus time table entry:', error);
      res.status(500).json({ message: 'An error occurred while updating the bus time table entry.' });
    }
});
  

// Delete a bus time table entry
router.delete('/deleteBusTimeTable/:id', async (req, res) => {
  try {
    await BusTimeTable.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bus time table entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting bus time table entry:', error);
    res.status(500).json({ error: 'An error occurred while deleting bus time table entry' });
  }
});

module.exports = router;
