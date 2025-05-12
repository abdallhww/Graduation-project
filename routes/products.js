const express = require("express");
const productsRouter = express.Router();
const {addproduct , updateProduct , productsellerid , deleteProduct , uploadProductImage , upload ,viewProductDetails} = require("../controllers/product");

productsRouter.post('/addproduct', addproduct);

productsRouter.post("/updateProduct", updateProduct);

productsRouter.post("/productsellerid", productsellerid);

productsRouter.post("/deleteProduct",deleteProduct);

productsRouter.post("/uploadProductImage", upload.single("image"), uploadProductImage);

productsRouter.get('/product/:id', viewProductDetails);

module.exports =  { productsRouter };