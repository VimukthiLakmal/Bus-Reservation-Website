const mongoose = require('mongoose');
const busRouteSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: true,
    unique: true
  },
  startPoint: {
    type: String,
    required: true
  },
  endPoint: {
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default : '1'
  }
});

const BusRoute = mongoose.model('BusRoute', busRouteSchema);
module.exports = BusRoute;
