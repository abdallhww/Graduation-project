const express = require("express");
const selesRoutes = express.Router();
const { salestoday , salestotal , filterSales , getSalesData , selectBroker} = require("../controllers/seles");

selesRoutes.get('/salestoday', salestoday);

selesRoutes.get('/salestotal', salestotal);

selesRoutes.get('/filter', filterSales);

selesRoutes.get('/saleschart',getSalesData);

selesRoutes.post('/selbro/:brokerId',selectBroker);

module.exports =  { selesRoutes }; 