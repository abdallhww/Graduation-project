const express = require('express');
const paypalrouts = express.Router();
const { completePayment , successPayment , cancelPayment} = require('../controllers/paypal');

paypalrouts.post('/complete-payment3', completePayment);

paypalrouts.get('/paypal-success', successPayment);

paypalrouts.get('/paypal-cancel', cancelPayment);

module.exports = { paypalrouts };