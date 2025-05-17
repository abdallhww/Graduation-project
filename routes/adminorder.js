const express = require("express");
const adminorder = express.Router();
const { showOrders , searchOrderItems , updateOrderStatus , deleteOrder } = require("../controllers/adminorder");

adminorder.get('/showOrders',showOrders);

adminorder.get('/searchOrderItems',searchOrderItems);

adminorder.post('/updateOrderStatus',updateOrderStatus);

adminorder.post('/deleteOrder',deleteOrder);

module.exports = { adminorder };