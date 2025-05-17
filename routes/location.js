const express = require('express');
const locationrouts = express.Router();
const { saveLocation , thanks } = require('../controllers/location');

locationrouts.post('/save-location/:brokerId', saveLocation);

locationrouts.post('/complete-payment',thanks);

module.exports = { locationrouts };