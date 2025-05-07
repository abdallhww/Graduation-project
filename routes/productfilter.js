const express = require("express");
const productfilter = express.Router();
const {Viewproducts , ViewFoodProducts ,
    ViewElectronicsProducts , ViewClothingProducts ,
    ViewBeautyProducts ,ViewFurnitureProducts ,
    ViewBooksProducts , ViewPerfumesProducts}= require("../controllers/productfilter");

productfilter.get('/Viewproducts',Viewproducts);

productfilter.get('/ViewFoodProducts',ViewFoodProducts);

productfilter.get('/ViewElectronicsProducts',ViewElectronicsProducts);

productfilter.get('/ViewClothingProducts',ViewClothingProducts);

productfilter.get('/ViewFurnitureProducts',ViewFurnitureProducts);

productfilter.get('/ViewBeautyProducts',ViewBeautyProducts);

productfilter.get('/ViewBooksProducts',ViewBooksProducts);

productfilter.get('/ViewPerfumesProducts',ViewPerfumesProducts);

module.exports =  { productfilter };