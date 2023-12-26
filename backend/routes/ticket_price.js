const express = require('express');
const router = express.Router();
const TicketPrice = require('../model/ticket_price');

// GET all ticket prices
router.get('/getAllRole', async (req, res) => {
  try {
    const ticketPrices = await TicketPrice.find();
    res.json(ticketPrices);
  } catch (error) {
    console.error('Error fetching ticket prices:', error);
    res.status(500).json({ error: 'Failed to fetch ticket prices.' });
  }
});

// GET a single ticket price by role_name
router.get('/:role_name', async (req, res) => {
  try {
    const { role_name } = req.params;
    const ticketPrice = await TicketPrice.findOne({ role_name });
    if (!ticketPrice) {
      return res.status(404).json({ message: 'Ticket price not found.' });
    }
    res.json(ticketPrice);
  } catch (error) {
    console.error('Error fetching ticket price:', error);
    res.status(500).json({ error: 'Failed to fetch ticket price.' });
  }
});

// CREATE a new ticket price
router.post('/saveARole', async (req, res) => {
  try {
    const { role_name, price } = req.body;
    const newTicketPrice = new TicketPrice({ role_name, price });
    await newTicketPrice.save();
    res.status(201).json(newTicketPrice);
  } catch (error) {
    console.error('Error creating ticket price:', error);
    res.status(500).json({ error: 'Failed to create ticket price.' });
  }
});

// UPDATE a ticket price by role_name
router.put('/:updateARole/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { price } = req.body;
    
        if (!price) {
          return res.status(400).json({ message: 'Price is required for update.' });
        }
    
        const updatedRole = await TicketPrice.findByIdAndUpdate(
          id,
          { price },
          { new: true }
        );
    
        if (!updatedRole) {
          return res.status(404).json({ message: 'Role not found.' });
        }
    
        res.json({ message: 'Price updated successfully.', updatedRole });
    } catch (error) {
        console.error('Error updating price:', error);
        res.status(500).json({ error: 'Failed to update price.' });
    }
});

    

router.delete('/:deleteARole/:id', async (req, res) => {
    try {
      const {id } = req.params;
  
      const deletedRole = await TicketPrice.findByIdAndDelete(id);
      if (!deletedRole) {
        return res.status(404).json({ message: 'Role not found.' });
      }
  
      res.json({ message: 'Role deleted successfully.' });
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(500).json({ error: 'Failed to delete role.' });
    }
}); 

module.exports = router;
