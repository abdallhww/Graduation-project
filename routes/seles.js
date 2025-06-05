const express = require("express");
const selesRoutes = express.Router();
const { salestoday , salestotal , filterSales , getSalesData , selectBroker , salestotalw , filterSales2} = require("../controllers/seles");

selesRoutes.get('/salestoday', salestoday);

selesRoutes.get('/salestotal', salestotal);

selesRoutes.get('/filter', filterSales);

selesRoutes.get('/saleschart',getSalesData);

selesRoutes.post('/selbro/:brokerId',selectBroker);

selesRoutes.get('/sales',salestotalw);

selesRoutes.get('/filter2', filterSales2);

module.exports =  { selesRoutes }; 