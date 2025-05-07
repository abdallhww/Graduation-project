const express = require("express");
const orderRouter = express.Router();
const { submitOrder , showPaymentPage , getUserOrders } = require("../controllers/ordercontroler");

orderRouter.post('/submit-order/:userId', submitOrder);

orderRouter.get('/payment/:orderId', showPaymentPage);

orderRouter.get('/orders/:userId',getUserOrders);


module.exports =  { orderRouter };