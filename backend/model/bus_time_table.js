const mongoose = require('mongoose');

const busTimeTableSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }
});

const BusTimeTable = mongoose.model('BusTimeTable', busTimeTableSchema);
module.exports = BusTimeTable;
