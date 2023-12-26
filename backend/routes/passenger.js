const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Passenger = require('../model/passanger'); 

// Route to create a new passenger
router.post('/addPassengers', async (req, res) => {
  try {
    const { name, email, gender, telephone, bloodGroup, dateOfBirth, address, password } = req.body;

    // Hash the password using bcrypt
    const saltRounds = 10; // You can adjust the saltRounds value as needed (higher values increase the security but take longer to hash)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newPassenger = new Passenger({
      name,
      email,
      gender,
      telephone,
      bloodGroup,
      dateOfBirth,
      address,
      password: hashedPassword, // Save the hashed password to the database
    });

    await newPassenger.save();
    res.status(201).json(newPassenger);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Passenger.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials. Incorrect password.' });
    }
 
    const isAdmin = (email === 'admin@gmail.com');
    const token = {status: "success", userId: user._id , message: 'login success' , isAdmin : isAdmin,email:email};
    res.json(token);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST route for password reset
router.post('/passReset/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const newPassword = req.body.newPassword;
    const user = await Passenger.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Error resetting password:', err);
    return res.status(500).json({ error: 'An error occurred while resetting the password' });
  }
});

// Route to get all passengers
router.get('/passengers', async (req, res) => {
  try {
    const passengers = await Passenger.find();
    res.status(200).json(passengers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get a specific passenger by ID
router.get('/passengers/:id', async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) {
      return res.status(404).json({ error: 'Passenger not found' });
    }
    res.status(200).json(passenger);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to update a specific passenger by ID
router.patch('/passengers/:id', async (req, res) => {
  try {
    const passenger = await Passenger.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!passenger) {
      return res.status(404).json({ error: 'Passenger not found' });
    }
    res.status(200).json(passenger);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to delete a specific passenger by ID
router.delete('/passengers/:id', async (req, res) => {
  try {
    const passenger = await Passenger.findByIdAndDelete(req.params.id);
    if (!passenger) {
      return res.status(404).json({ error: 'Passenger not found' });
    }
    res.status(200).json({ message: 'Passenger deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
