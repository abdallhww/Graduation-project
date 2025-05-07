const express = require("express");
const selesRoutes = express.Router();
const { salestoday , salesweek , salesmonth, salestotal  } = require("../controllers/seles");

selesRoutes.get('/salestoday', salestoday);

selesRoutes.get('/salesweek', salesweek);

selesRoutes.get('/salesmonth', salesmonth);

selesRoutes.get('/salestotal', salestotal);

module.exports =  { selesRoutes };