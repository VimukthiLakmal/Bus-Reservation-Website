const express = require('express');
const router = express.Router();
const axios = require('axios');
const { URLSearchParams } = require('url');

router.post('/distanceCal', async (req, res) => {
  try {
    const { origin, destination, apiKey } = req.body;

    // Construct the API URL using the url module
    const apiUrl = 'https://maps.googleapis.com/maps/api/directions/json';
    const params = new URLSearchParams({
      origin: origin,
      destination: destination,
      key: apiKey,
    });
    const apiCallUrl = `${apiUrl}?${params}`;

    // Make the API call to Google Maps Directions API
    const response = await axios.get(apiCallUrl);

    // Parse the response to get the distance
    const distance = response.data.routes[0]?.legs[0]?.distance?.text || 'N/A';

    res.json({ distance });
  } catch (error) {
    console.error('Error fetching distance:', error);
    res.status(500).json({ error: 'Failed to fetch distance from Google Maps API' });
  }
});

module.exports = router;
