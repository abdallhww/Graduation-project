const express = require("express");
const productsRouter = express.Router();
const {addproduct,updateProduct,productsellerid,deleteProduct,uploadProductImage,upload } = require("../controllers/product");

productsRouter.post('/addproduct', addproduct);

productsRouter.post("/updateProduct", updateProduct);

productsRouter.post("/productsellerid", productsellerid);

productsRouter.post("/deleteProduct",deleteProduct);

productsRouter.post("/uploadProductImage", upload.single("image"), uploadProductImage);

module.exports =  {productsRouter};