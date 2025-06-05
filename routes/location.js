const express = require('express');
const locationrouts = express.Router();
const { saveLocation , thanks , thanks2 } = require('../controllers/location');

locationrouts.post('/save-location/:brokerId', saveLocation );

locationrouts.post('/complete-payment',thanks );

locationrouts.post('/complete-payment2',thanks2 );

module.exports = { locationrouts };