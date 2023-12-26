const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const url = process.env.ATLAS_URI;
global.URL = url;

mongoose.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB connection successfully.");
});

app.use(cors()); 

app.use(express.json());

const bus = require('./routes/bus.js');
app.use('/bus', bus);

const employee = require('./routes/employee.js');
app.use('/employee', employee);

const passenger = require('./routes/passenger.js');
app.use('/passenger', passenger);

const bus_route = require('./routes/bus_route.js');
app.use('/bus_route', bus_route);

const ticket_price = require('./routes/ticket_price.js');
app.use('/ticket_price', ticket_price);

const trip = require('./routes/trip.js');
app.use('/trip', trip);

const tripPriceMaster = require('./routes/trip_price_master.js');
app.use('/tripPriceMaster', tripPriceMaster);

const busTimeTemplate = require('./routes/bus_time_table.js');
app.use('/busTimeTemplate', busTimeTemplate);

const ticketBooking = require('./routes/ticket_booking.js');
app.use('/ticketBooking', ticketBooking);

const payment = require('./routes/payment.js');
app.use('/payment', payment);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
