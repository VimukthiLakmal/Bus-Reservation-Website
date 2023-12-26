const express = require("express");
const router = express.Router();
const BusTimeTable = require("../model/bus_time_table");
const Booking = require("../model/ticket_booking");
const Passenger = require("../model/passanger");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "bluephoenix783@gmail.com",
    pass: "jrud hnbj cfuw pbtr",
  },
});

router.post("/getTimeTempUsingRoute/:route", async (req, res) => {
  const { route } = req.params;

  try {
    const timeTemplates = await BusTimeTable.find({ route: route });

    if (timeTemplates.length === 0) {
      return res.json([]);
    }

    res.json(timeTemplates);
  } catch (error) {
    console.error("Error fetching time templates:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching time templates." });
  }
});

// Create a new booking
router.post("/addBookings", async (req, res) => {
  try {
    const newBooking = await Booking.create(req.body.rest);

    
    const mailOptions = {
      from: "bluephoenix783@gmail.com",
      to:req.body.email,
      subject:"New Booking",
      text:`Dear Customer, Bus ${req.body.rest.bus} has booked for ${req.body.rest.bookingDate}.`,
    };


    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send("Email sending failed");
      } else {
        console.log("Email sent: " + info.response);
        res.send("Email sent successfully");
      }
    });

    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: "Failed to create booking" });
    console.log(err);
  }
});

// Get all bookings
router.get("/getBookings", async (req, res) => {
  try {
    const bookings = await Booking.find();

    // Fetch passenger details and time slot for each booking and replace customerId with passenger name and timeSlot
    const bookingsWithNamesAndTimeSlots = await Promise.all(
      bookings.map(async (booking) => {
        const passenger = await Passenger.findById(booking.customerId);
        const busTimeTable = await BusTimeTable.findById(booking.timeSlot);

        if (passenger && busTimeTable) {
          // Replace the customerId with passenger name and include the timeSlot in the booking object
          return {
            ...booking.toObject(),
            customerId: passenger.name,
            timeSlot: busTimeTable.startTime + " - " + busTimeTable.endTime,
          };
        } else {
          // If passenger or timeSlot not found, return the booking as is
          return booking.toObject();
        }
      })
    );

    res.json(bookingsWithNamesAndTimeSlots);
  } catch (err) {
    res.status(500).json({ error: "Failed to get bookings" });
    console.log(err);
  }
});

router.get("/getBookings/:route/:timeslot/:bookingdate", async (req, res) => {
  try {
    const { route, timeslot, bookingdate } = req.params;

    const currentBookings = await Booking.find({
      route: route,
      timeSlot: timeslot,
      bookingDate: bookingdate,
    });

    const bookedSeats = currentBookings.reduce((seats, booking) => {
      return seats.concat(booking.seatNumbers);
    }, []);

    res.json({ currentBookings, bookedSeats });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a specific booking by ID
router.get("/getBookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Failed to get booking" });
  }
});


// Route for getting a specific booking by user ID
router.get('/getBooking/:uid', async (req, res) => {
  try {
    const booking = await Booking.find({ customerId: req.params.uid });
   
     const bookingsWithNamesAndTimeSlots = await Promise.all(
      booking.map(async (booking) => {
        const passenger = await Passenger.findById(booking.customerId);
        const busTimeTable = await BusTimeTable.findById(booking.timeSlot);

        if (passenger && busTimeTable) {

          return {
            ...booking.toObject(),
            customerId: passenger.name,
            timeSlot: busTimeTable.startTime + " - " + busTimeTable.endTime,
          };
        } else {
          // If passenger or timeSlot not found, return the booking as is
          return booking.toObject();
        }
      })
    );

    res.json(bookingsWithNamesAndTimeSlots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route for updating rating
router.put('/updateBookings/ratings/:id', async (req, res) => {
 
  try {
    const query = { _id: req.params.id }; 
    const update = { $set: { rating: req.body.rating } }; 
    const updatedB = await Booking.findByIdAndUpdate(query, update, { new: true });
    res.json(updatedB);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// Update a booking by ID
router.put("/updateBookings/:id", async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ error: "Failed to update booking" });
  }
});

router.put("/updateStatusBookings/:id", async (req, res) => {
  const bookingId = req.params.id;
  const newStatus = req.body.status; // Assuming you send the new status in the request body

  try {
    // Find the booking by ID
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      // If the booking with the given ID is not found, return an error response
      return res.status(404).json({ error: "Booking not found" });
    }

    const passenger = await Passenger.findById(booking.customerId);
    if (passenger) {
      const mailOptions = {
        from: "bluephoenix783@gmail.com",
        to: passenger.email,
        subject: "Booking Cancelled",
        text: `Dear Customer, Bus ${booking.bus} booking has cancelled.`,
      };


      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).send("Email sending failed");
        } else {
          console.log("Email sent: " + info.response);
          res.send("Email sent successfully");
        }
      });

    }

    // Update the booking status
    booking.status = newStatus;
    await booking.save();

    // Return the updated booking as a response
    res.json(booking);
  } catch (error) {
    // If any error occurs, return a 500 status code and an error response
    res.status(500).json({ error: "Failed to update booking status" });
  }
});

// Delete a booking by ID
router.delete("/deleteBookings/:id", async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndRemove(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
});
module.exports = router;
