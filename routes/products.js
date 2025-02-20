const express = require("express");
const productsRouter = express.Router();
const {addproduct,updateProduct,productsellerid} = require("../controllers/product");

productsRouter.post('/addproduct', addproduct);

productsRouter.post("/updateProduct", updateProduct);

productsRouter.post("/productsellerid", productsellerid);

module.exports =  {productsRouter};