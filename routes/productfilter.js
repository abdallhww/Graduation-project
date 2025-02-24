const express = require("express");
const productfilter = express.Router();
const {Viewproducts} = require("../controllers/productfilter");

productfilter.get('/Viewproducts',Viewproducts);

module.exports =  {productfilter};