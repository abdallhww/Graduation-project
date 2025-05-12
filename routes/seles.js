const express = require("express");
const selesRoutes = express.Router();
const { salestoday , salestotal , filterSales , getSalesData} = require("../controllers/seles");

selesRoutes.get('/salestoday', salestoday);

selesRoutes.get('/salestotal', salestotal);

selesRoutes.get('/filter', filterSales);

selesRoutes.get('/saleschart',getSalesData);

module.exports =  { selesRoutes };