const express = require('express');
const router = express.Router();
const Driver = require('../model/employee'); 

// Route to create a new driver
router.post('/addEmployee', async (req, res) => {
  try {
    const newDriver = await Driver.create(req.body);
    res.status(201).json(newDriver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to get all drivers
router.get('/getEmployees', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get a specific driver by ID
router.get('/drivers/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to update a specific driver by ID
router.put('/drivers/:id', async (req, res) => {
  const driverId = req.params.id;
  const updatedData = req.body; 

  try {
    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found.' });
    }

    driver.name = updatedData.name;
    driver.age = updatedData.age;
    driver.experinceYears = updatedData.experinceYears;
    driver.contactNumber = updatedData.contactNumber;
    driver.address = updatedData.address;
    driver.bus = updatedData.bus;
    driver.position = updatedData.position;

    const updatedDriver = await driver.save();

    res.json({ message: 'Driver updated successfully.', driver: updatedDriver });
  } catch (error) {
    console.error('Error updating driver:', error);
    res.status(500).json({ message: 'An error occurred while updating the driver.' });
  }
});
  

// Route to delete a specific driver by ID
router.delete('/deleteDrivers/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/searchEmp/:fullName', async (req, res) => {
  try {
    const searchQuery = req.params.fullName;
    const regex = new RegExp(searchQuery, 'i'); 

    const foundEmployees = await Driver.find({ name: regex });

    if (foundEmployees.length === 0) {
      return res.status(200).json({ message: 'No employees found with the provided name.'  , employees: false });
    }

    res.status(200).json({ status: 'success', employees: foundEmployees });
  } catch (error) {
    console.error('Error searching employees:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
module.exports = router;
