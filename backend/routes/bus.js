const express = require("express");
const router = express.Router();
const Bus = require("../model/bus");
const Location = require("../model/locations");

// Route for adding new buses
router.post("/Addbuses", async (req, res) => {
  try {
    // Extract data from the request body
    const {
      busNumber,
      chassisNumber,
      registeredDate,
      brand,
      passengersCapacity,
      busType,
      kmPerL,
      busRoute,
      busPurpose,
      img,
    } = req.body;

    // Create a new Bus document using the data
    const newBus = new Bus({
      busNumber,
      chassisNumber,
      registeredDate,
      brand,
      passengersCapacity,
      busType,
      kmPerL,
      busRoute,
      busPurpose,
      img,
    });

    // Save the newBus document to the database
    await newBus.save();

    // Respond with a success message
    res.status(201).json({ message: "Bus added successfully" });
  } catch (error) {
    // If there's an error, respond with an error message
    res.status(500).json({ error: "Failed to add the bus" });
    console.log(error);
  }
});

// Route to get all buses
router.get("/getBuses", async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get only public transport
router.get("/getPublicTransportBuses", async (req, res) => {
  try {
    const buses = await Bus.find({ busPurpose: "pr" });
    res.json({ buses });
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ error: "An error occurred while fetching buses" });
  }
});

//get only special tour
router.get("/getOnlySpecialTour", async (req, res) => {
  try {
    const buses = await Bus.find({ busPurpose: "sp" });
    res.json({ buses });
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ error: "An error occurred while fetching buses" });
  }
});

// Route to get a specific bus by bus Number
router.post("/buses/number", async (req, res) => {
  try {
    const bus = await Bus.findOne({ busNumber: req.body.number });
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }
    res.status(200).json(bus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get a specific bus by ID
router.get("/buses/:id", async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }
    res.status(200).json(bus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to update a specific bus by ID
router.patch("/buses/:id", async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }
    res.status(200).json(bus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to delete a specific bus by ID
router.delete("/deleteBuses/:id", async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }
    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/getBusDataFromBusNumber/:busNumber", async (req, res) => {
  try {
    const busNumber = req.params.busNumber;

    // Find the bus with the given busNumber in the database
    const bus = await Bus.findOne({ busNumber });

    if (!bus) {
      // If no bus is found with the given busNumber, send a 404 (Not Found) response
      return res.status(404).json({ error: "Bus not found" });
    }

    // If the bus is found, send the bus data as a response
    res.json(bus);
  } catch (error) {
    // If there's an error, send a 500 (Internal Server Error) response with the error message
    console.error("Error fetching bus data:", error);
    res.status(500).json({ error: "Failed to fetch bus data" });
  }
});

router.get("/searchUsingBusNumber/:busNumber", async (req, res) => {
  try {
    const searchQuery = req.params.busNumber;
    const regex = new RegExp(searchQuery, "i");

    const foundBuses = await Bus.find({ busNumber: regex });

    if (foundBuses.length === 0) {
      return res
        .status(200)
        .json({
          message: "No buses found with the provided bus number.",
          buses: false,
        });
    }

    res.status(200).json({ status: "success", buses: foundBuses });
  } catch (error) {
    console.error("Error searching buses:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.put("/statusChange/:id", async (req, res) => {
  try {
    const itemId = req.params.id;

    const item = await Bus.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found." });
    }

    item.status = item.status === "1" ? "0" : "1";
    await item.save();

    res.json({ status: "success", message: "Status changed successfully." });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

// Route to get all buses locations
router.get("/getLocations", async (req, res) => {
  try {
    const loc = await Location.find();
    res.status(200).json(loc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to add  bus location
router.post("/addLocations", async (req, res) => {
  try {
    const uniqueIdentifier = req.body.number;
    const loc =await Location.findOneAndUpdate({ busNumber: uniqueIdentifier },req.body, {
      upsert: true,
      new: true,
    });
    res.status(200).json(loc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
